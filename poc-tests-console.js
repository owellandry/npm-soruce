// ================================================================
// PoC Tests para npmjs.com - Ejecutar en la consola del navegador
// Solo pruebas pasivas/observacionales en tu propia sesión
// ================================================================


// ================================================================
// TEST 1: Verificar exposición de window.__context__ (SSR State)
// Página: cualquier página de npmjs.com
// ================================================================

console.log("=== TEST 1: Exposición de __context__ ===");
if (window.__context__) {
    console.log("[+] window.__context__ EXPUESTO");
    console.log("    Chunks:", Object.keys(window.__context__.chunks || {}).length);
    console.log("    PublicPath:", window.__context__.publicPath);
    console.log("    HeaderName:", window.__context__.headerName);
    console.log("    ManifestHash:", window.__context__.hash);
    console.log("    ContainerId:", window.__context__.containerId);
    console.log("    Renderer:", window.__context__.name);

    // Verificar si hay csrftoken expuesto
    if (window.__context__.context && window.__context__.context.csrftoken) {
        console.log("[!] CSRF Token expuesto:", window.__context__.context.csrftoken.substring(0, 10) + "...");
    }

    // Listar todas las props del contexto
    if (window.__context__.context) {
        console.log("    Props disponibles:", Object.keys(window.__context__.context));
    }
} else {
    console.log("[-] window.__context__ no disponible");
}


// ================================================================
// TEST 2: Verificar Source Map accesible desde el navegador
// Página: cualquier página de npmjs.com
// ================================================================

console.log("\n=== TEST 2: Source Maps Accesibles ===");
(async () => {
    const scripts = document.querySelectorAll('script[src]');
    for (const script of scripts) {
        const mapUrl = script.src + '.map';
        try {
            const res = await fetch(mapUrl, { method: 'HEAD' });
            if (res.ok) {
                const size = res.headers.get('content-length');
                console.log(`[+] ACCESIBLE: ${mapUrl} (${(size/1024/1024).toFixed(2)} MB)`);
            } else {
                console.log(`[-] Bloqueado: ${mapUrl} (HTTP ${res.status})`);
            }
        } catch(e) {
            console.log(`[-] Error: ${mapUrl}`);
        }
    }
})();


// ================================================================
// TEST 3: Verificar componentes React internos expuestos
// Página: cualquier página de npmjs.com
// ================================================================

console.log("\n=== TEST 3: Internals de React Expuestos ===");
const appEl = document.getElementById('app');
if (appEl && appEl._reactRootContainer) {
    console.log("[+] React root container accesible");
    console.log("[+] Se puede acceder al fiber tree de React");
} else if (appEl && appEl.__reactInternalInstance) {
    console.log("[+] React internal instance accesible (legacy)");
}

// Verificar Redux DevTools
if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    console.log("[+] Redux DevTools hook disponible");
}


// ================================================================
// TEST 4: Verificar debug console.log en Password component
// Página: https://www.npmjs.com/login
// Instrucción: Hacer clic en "Show/Hide" del campo password
// ================================================================

console.log("\n=== TEST 4: Debug Logs en Password ===");
console.log("[*] Para verificar: ir a /login, escribir algo en password");
console.log("[*] Hacer clic en 'Show' para toggle visibility");
console.log("[*] Observar si aparece console.log con el nombre del input");
console.log("[*] Buscar: 'show-hide-password' en la consola");


// ================================================================
// TEST 5: Verificar HTTP Parameter Pollution en Search
// Página: https://www.npmjs.com/
// ================================================================

console.log("\n=== TEST 5: Parameter Pollution en Search ===");
(async () => {
    // Inyectar parámetro extra via búsqueda
    const payload = "react&debug=true&admin=1";
    const url = `/search/suggestions?q=${payload}`;
    console.log(`[*] Request: ${url}`);

    try {
        const res = await fetch(url, {
            headers: { 'x-requested-with': 'XMLHttpRequest' }
        });
        const data = await res.text();
        console.log(`[*] Status: ${res.status}`);
        console.log(`[*] Response (primeros 200 chars): ${data.substring(0, 200)}`);

        // Comparar con request normal
        const normalUrl = `/search/suggestions?q=${encodeURIComponent(payload)}`;
        const normalRes = await fetch(normalUrl, {
            headers: { 'x-requested-with': 'XMLHttpRequest' }
        });
        const normalData = await normalRes.text();

        if (data !== normalData) {
            console.log("[!] CONFIRMADO: Respuestas DIFERENTES - los parámetros inyectados afectan el resultado");
        } else {
            console.log("[-] Misma respuesta - el servidor ignora los parámetros extra");
        }
    } catch(e) {
        console.log("[-] Error:", e.message);
    }
})();


// ================================================================
// TEST 6: Verificar Octocaptcha - Análisis del componente
// Página: https://www.npmjs.com/signup
// ================================================================

console.log("\n=== TEST 6: Análisis de Octocaptcha ===");
console.log("[*] Para probar el bypass del captcha:");
console.log("[*] 1. Ir a https://www.npmjs.com/signup");
console.log("[*] 2. Ejecutar este código:");
console.log(`
// --- PEGAR ESTO EN /signup ---

// Verificar iframe del captcha
const captchaFrame = document.querySelector('iframe[title*="captcha"]');
if (captchaFrame) {
    console.log("[+] Iframe de Octocaptcha encontrado:", captchaFrame.src);
    console.log("[+] Dimensiones:", captchaFrame.width, "x", captchaFrame.height);

    // Verificar el hidden input del token
    const tokenInput = document.querySelector('input[name="octocaptchaToken"]');
    const errorInput = document.querySelector('input[name="errorLoadingCaptcha"]');

    if (tokenInput) console.log("[+] Token input encontrado, valor:", tokenInput.value || "(vacío)");
    if (errorInput) console.log("[+] Error input encontrado, valor:", errorInput.value);

    // Verificar estado del botón submit
    const submitBtn = document.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
        console.log("[+] Submit button:", submitBtn.disabled ? "DESHABILITADO" : "HABILITADO");
    }
} else {
    console.log("[-] No se encontró iframe de captcha en esta página");
}
`);


// ================================================================
// TEST 7: Verificar exposición del CSRF token en el DOM
// Página: cualquier página autenticada
// ================================================================

console.log("\n=== TEST 7: CSRF Token en DOM ===");
const csrfInputs = document.querySelectorAll('input[name="csrftoken"]');
if (csrfInputs.length > 0) {
    console.log(`[+] ${csrfInputs.length} input(s) de CSRF token encontrados en el DOM`);
    csrfInputs.forEach((input, i) => {
        console.log(`    Token ${i+1}: ${input.value.substring(0, 15)}...`);
    });
} else {
    console.log("[*] No hay CSRF tokens en el DOM (no autenticado o no hay formularios)");
}


// ================================================================
// TEST 8: Verificar headers Spiferack en navegación
// Página: cualquier página
// ================================================================

console.log("\n=== TEST 8: Headers Spiferack ===");
(async () => {
    try {
        const res = await fetch('/search?q=test', {
            headers: {
                'x-requested-with': 'XMLHttpRequest',
                'x-spiferack': '1',
                'manifest-hash': 'invalid-hash-to-test'
            }
        });

        console.log("[*] Response headers de Spiferack:");
        console.log("    rendererName:", res.headers.get('rendererName'));
        console.log("    manifest-hash:", res.headers.get('manifest-hash'));
        console.log("    push-state:", res.headers.get('push-state'));
        console.log("    Content-Type:", res.headers.get('content-type'));
        console.log("    Status:", res.status);

        // Si devuelve JSON con invalid hash, muestra info interesante
        if (res.headers.get('content-type')?.includes('json')) {
            const data = await res.json();
            if (data['x-spiferack-redirect']) {
                console.log("[!] x-spiferack-redirect detectado:", data['x-spiferack-redirect']);
            }
            console.log("[+] Respuesta JSON con", Object.keys(data).length, "keys");
            console.log("    Keys:", Object.keys(data).slice(0, 10).join(', '));
        }
    } catch(e) {
        console.log("[-] Error:", e.message);
    }
})();


// ================================================================
// TEST 9: Enumerar todas las rutas registradas en el Registry
// Página: cualquier página
// ================================================================

console.log("\n=== TEST 9: Registry de Spiferack ===");
if (window.__context__ && window.__context__.chunks) {
    const chunks = Object.keys(window.__context__.chunks);
    console.log(`[+] ${chunks.length} rutas/páginas registradas:`);
    chunks.forEach(c => console.log(`    - ${c}`));
}
