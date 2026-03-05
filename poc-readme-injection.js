// ================================================================
// PoC: HTML Injection via README (document-context)
// EJECUTAR EN: https://www.npmjs.com/package/{cualquier-paquete}
// Ejemplo: https://www.npmjs.com/package/express
//
// Este test analiza qué HTML permite el sanitizador del server
// en los READMEs de paquetes, y si document-context lo inyecta
// sin re-sanitizar.
// ================================================================

console.log("=== PoC: README HTML Injection Analysis ===\n");

// PARTE 1: Analizar el README renderizado en la página actual
(() => {
    console.log("═══ PARTE 1: Análisis del README actual ═══\n");

    // Buscar el contenedor del README
    const selectors = [
        '#readme',
        '#tabpanel-readme',
        '[data-testid="readme"]',
        '.package-readme',
        '.markdown',
        // El ID que usa document-context viene en __context__
    ];

    let readmeEl = null;
    for (const sel of selectors) {
        readmeEl = document.querySelector(sel);
        if (readmeEl) {
            console.log(`[+] README encontrado con selector: ${sel}`);
            break;
        }
    }

    // También verificar documentContext
    const ctx = window.__context__?.context || window.__context__ || {};
    if (ctx.documentContext) {
        console.log(`[+] documentContext: ${JSON.stringify(ctx.documentContext)}`);
        for (const [path, domId] of Object.entries(ctx.documentContext)) {
            const el = document.getElementById(domId);
            if (el) {
                console.log(`[+] Elemento de documentContext encontrado: #${domId}`);
                if (!readmeEl) readmeEl = el;
            }
        }
    }

    if (!readmeEl) {
        console.log("[-] No se encontró README en esta página");
        console.log("[*] Navega a una página de paquete (ej: /package/express)");
        return;
    }

    const html = readmeEl.innerHTML;
    console.log(`[+] HTML total: ${html.length} caracteres\n`);

    // Análisis de tags permitidos
    const tagRegex = /<([a-z][a-z0-9-]*)/gi;
    const tagCounts = {};
    let match;
    while ((match = tagRegex.exec(html)) !== null) {
        const tag = match[1].toLowerCase();
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }

    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    console.log("[+] Tags HTML presentes en el README:");
    sortedTags.forEach(([tag, count]) => {
        console.log(`    <${tag}> × ${count}`);
    });

    // Análisis de atributos
    console.log("\n[+] Análisis de atributos:");

    const allEls = readmeEl.querySelectorAll('*');
    const attrCounts = {};
    const dangerousAttrs = [];

    allEls.forEach(el => {
        for (const attr of el.attributes) {
            const name = attr.name.toLowerCase();
            attrCounts[name] = (attrCounts[name] || 0) + 1;

            // Detectar atributos peligrosos
            if (name.startsWith('on')) {
                dangerousAttrs.push({ el: el.tagName, attr: name, val: attr.value });
            }
            if (name === 'href' && attr.value.startsWith('javascript:')) {
                dangerousAttrs.push({ el: el.tagName, attr: name, val: attr.value });
            }
            if (name === 'src' && attr.value.startsWith('data:')) {
                dangerousAttrs.push({ el: el.tagName, attr: name, val: attr.value });
            }
            if (name === 'style' && attr.value.includes('expression(')) {
                dangerousAttrs.push({ el: el.tagName, attr: name, val: attr.value });
            }
            if (name === 'action' || name === 'formaction') {
                dangerousAttrs.push({ el: el.tagName, attr: name, val: attr.value });
            }
        }
    });

    const sortedAttrs = Object.entries(attrCounts).sort((a, b) => b[1] - a[1]);
    console.log("    Atributos encontrados:");
    sortedAttrs.forEach(([attr, count]) => {
        console.log(`      ${attr} × ${count}`);
    });

    if (dangerousAttrs.length > 0) {
        console.log("\n[!!!] ATRIBUTOS PELIGROSOS ENCONTRADOS:");
        dangerousAttrs.forEach(d => {
            console.log(`    <${d.el} ${d.attr}="${d.val.substring(0, 80)}">`);
        });
    } else {
        console.log("\n[+] No se encontraron atributos peligrosos directos");
    }

    // Verificar links
    const links = readmeEl.querySelectorAll('a[href]');
    const externalLinks = [];
    const jsLinks = [];
    links.forEach(a => {
        const href = a.getAttribute('href');
        if (href.startsWith('javascript:')) {
            jsLinks.push(href);
        } else if (href.startsWith('http') && !href.includes('npmjs.com')) {
            externalLinks.push(href);
        }
    });

    console.log(`\n[+] Links: ${links.length} total, ${externalLinks.length} externos`);
    if (jsLinks.length > 0) {
        console.log(`[!!!] javascript: links: ${jsLinks.length}`);
        jsLinks.forEach(l => console.log(`    ${l}`));
    }

    // Verificar imágenes
    const imgs = readmeEl.querySelectorAll('img');
    console.log(`[+] Imágenes: ${imgs.length}`);
    imgs.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('https://')) {
            console.log(`    [!] Imagen no-HTTPS: ${src.substring(0, 100)}`);
        }
        if (img.getAttribute('onerror')) {
            console.log(`    [!!!] Imagen con onerror: ${img.getAttribute('onerror')}`);
        }
    });

    // Verificar SVG
    const svgs = readmeEl.querySelectorAll('svg');
    if (svgs.length > 0) {
        console.log(`\n[!] SVGs encontrados: ${svgs.length}`);
        svgs.forEach((svg, i) => {
            const svgHtml = svg.outerHTML.substring(0, 200);
            console.log(`    SVG #${i}: ${svgHtml}...`);
            // SVG puede contener scripts via <script>, <use>, <foreignObject>
            if (svg.querySelector('script, use[href], foreignObject, animate[onbegin]')) {
                console.log(`    [!!!] SVG con elementos ejecutables`);
            }
        });
    }

    // Verificar iframes y objects
    const embeds = readmeEl.querySelectorAll('iframe, object, embed, applet, base');
    if (embeds.length > 0) {
        console.log(`\n[!!!] Elementos embebidos: ${embeds.length}`);
        embeds.forEach(e => console.log(`    <${e.tagName.toLowerCase()}>`));
    }

    // Verificar forms
    const forms = readmeEl.querySelectorAll('form, input, button, select, textarea');
    if (forms.length > 0) {
        console.log(`\n[!] Elementos de formulario: ${forms.length}`);
        forms.forEach(f => console.log(`    <${f.tagName.toLowerCase()} action="${f.action || ''}">`));
    }

    // Verificar meta tags y base tags
    const metas = readmeEl.querySelectorAll('meta, base, link[rel="import"]');
    if (metas.length > 0) {
        console.log(`\n[!!!] Meta/Base tags: ${metas.length}`);
    }

})();


// PARTE 2: Verificar el proceso de rehydration de document-context
console.log("\n═══ PARTE 2: Proceso de rehydration ═══\n");

(() => {
    const ctx = window.__context__?.context || window.__context__ || {};

    if (!ctx.documentContext) {
        console.log("[-] Sin documentContext. Saltando.");
        return;
    }

    console.log("[*] El middleware document-context.js hace lo siguiente:");
    console.log("    1. Lee props.documentContext = { 'path.to.prop': 'dom-element-id' }");
    console.log("    2. Busca el DOM element por ID");
    console.log("    3. Lee el.innerHTML (HTML RAW del server)");
    console.log("    4. Lo asigna a props[path][to][prop] = el.innerHTML");
    console.log("    5. React usa ese valor para renderizar");
    console.log("");
    console.log("[*] Si el componente que recibe este prop usa dangerouslySetInnerHTML,");
    console.log("    el HTML se renderiza sin escapar.");
    console.log("[*] Si usa {prop} normal, React lo escapa automáticamente.");
    console.log("");

    // Verificar los paths del documentContext
    for (const [propPath, domId] of Object.entries(ctx.documentContext)) {
        console.log(`[*] Path: ${propPath} → DOM ID: ${domId}`);

        // El propPath nos dice dónde en props se inyecta el HTML
        // Si el path termina en algo como "readme" o "html", es probable
        // que se renderice con dangerouslySetInnerHTML
        if (propPath.includes('readme') || propPath.includes('html') ||
            propPath.includes('content') || propPath.includes('markup')) {
            console.log(`    [!] Path sugiere contenido HTML → probable dangerouslySetInnerHTML`);
        }
    }
})();


// PARTE 3: Probar si el sanitizador server-side permite payloads XSS conocidos
console.log("\n═══ PARTE 3: Test de sanitización del server ═══\n");

(async () => {
    // Para testear realmente la sanitización, necesitaríamos publicar
    // un paquete con un README malicioso. En su lugar, verificamos
    // qué headers de seguridad tiene npm para README rendering.

    console.log("[*] Verificando headers de seguridad...\n");

    try {
        const res = await fetch(window.location.href);
        const headers = {};
        res.headers.forEach((val, key) => {
            headers[key] = val;
        });

        // Headers relevantes para XSS
        const secHeaders = [
            'content-security-policy',
            'x-content-type-options',
            'x-xss-protection',
            'x-frame-options',
            'strict-transport-security',
            'cross-origin-opener-policy',
            'cross-origin-embedder-policy',
            'permissions-policy',
        ];

        for (const h of secHeaders) {
            if (headers[h]) {
                console.log(`[+] ${h}: ${headers[h].substring(0, 200)}`);
            } else {
                console.log(`[-] ${h}: NO PRESENTE`);
            }
        }

        // Analizar CSP
        const csp = headers['content-security-policy'];
        if (csp) {
            console.log("\n[*] Análisis de CSP:");
            const directives = csp.split(';').map(d => d.trim());
            directives.forEach(d => {
                console.log(`    ${d}`);
            });

            // ¿Permite inline scripts?
            if (csp.includes("'unsafe-inline'") && !csp.includes("'nonce-")) {
                console.log("\n[!!!] CSP permite 'unsafe-inline' sin nonce → XSS inline posible");
            }
            if (csp.includes("'unsafe-eval'")) {
                console.log("[!!!] CSP permite 'unsafe-eval' → eval/setTimeout XSS posible");
            }
            if (!csp.includes('script-src')) {
                console.log("[!!!] CSP no tiene script-src → scripts sin restricción");
            }
        } else {
            console.log("\n[!!!] SIN Content Security Policy → XSS tiene menos restricciones");
        }

    } catch(e) {
        console.log(`[-] Error verificando headers: ${e.message}`);
    }

    // Verificar si el README pasa por un iframe sandbox
    const readmeIframes = document.querySelectorAll('iframe[sandbox]');
    if (readmeIframes.length > 0) {
        console.log("\n[+] README renderizado en iframe con sandbox:");
        readmeIframes.forEach(f => {
            console.log(`    sandbox="${f.sandbox}"`);
        });
    } else {
        console.log("\n[-] README NO está en iframe sandbox (renderizado en el DOM principal)");
        console.log("[!!!] Si un payload pasa el sanitizador, se ejecuta en el contexto de npmjs.com");
    }
})();


// PARTE 4: Intentar inyección via DOM manipulation (simula lo que haría XSS)
console.log("\n═══ PARTE 4: Simulación de inyección via DOM ═══\n");

(() => {
    // Esta prueba NO modifica nada en el servidor.
    // Solo verifica si el mecanismo de rehydration de document-context
    // permite que HTML inyectado en un elemento DOM sea procesado.

    console.log("[*] Creando elemento de test con HTML malicioso...");

    // Crear un elemento temporal con un ID especial
    const testDiv = document.createElement('div');
    testDiv.id = '__xss_test_readme__';
    testDiv.innerHTML = '<img src=x onerror="window.__XSS_TEST_FIRED__=true"><b>XSS Test</b>';
    testDiv.style.display = 'none';
    document.body.appendChild(testDiv);

    // Verificar si el browser ejecutó el onerror
    setTimeout(() => {
        if (window.__XSS_TEST_FIRED__) {
            console.log("[!!!] onerror SE EJECUTÓ al insertar via innerHTML");
            console.log("[!!!] Esto confirma que innerHTML en document-context ejecutaría JS");
        } else {
            console.log("[+] onerror NO se ejecutó (browser no ejecuta scripts via innerHTML)");
            console.log("[*] NOTA: innerHTML no ejecuta <script> tags, pero SÍ ejecuta");
            console.log("[*] event handlers como onerror, onload en <img>, <svg>, etc.");
        }

        // Limpiar
        testDiv.remove();
        delete window.__XSS_TEST_FIRED__;
    }, 1000);

    // Verificar el resultado de innerHTML con SVG payload
    const testDiv2 = document.createElement('div');
    testDiv2.id = '__xss_test_svg__';
    testDiv2.innerHTML = '<svg onload="window.__SVG_XSS_TEST__=true"><circle r="10"/></svg>';
    testDiv2.style.display = 'none';
    document.body.appendChild(testDiv2);

    setTimeout(() => {
        if (window.__SVG_XSS_TEST__) {
            console.log("[!!!] SVG onload SE EJECUTÓ via innerHTML");
        } else {
            console.log("[+] SVG onload no se ejecutó via innerHTML");
        }
        testDiv2.remove();
        delete window.__SVG_XSS_TEST__;
    }, 1000);
})();


setTimeout(() => {
    console.log("\n═══════════════════════════════════════════════");
    console.log("  CONCLUSIONES");
    console.log("═══════════════════════════════════════════════\n");

    console.log("HALLAZGO #21 — XSS via dangerouslySetInnerHTML:");
    console.log("  Vectores analizados:");
    console.log("  a) notification.js — skipXSSEscaping NO se propaga via dispatch");
    console.log("     PERO: si el SSR envía notificaciones con skipXSSEscaping=true");
    console.log("     en los props iniciales, sería explotable");
    console.log("  b) radio.js — SIEMPRE renderiza description/text como HTML");
    console.log("     Si el server envía HTML en estos campos → XSS directo");
    console.log("  c) alert-banner.js — mismo caso que notification.js");
    console.log("");
    console.log("HALLAZGO #22 — HTML Injection via document-context:");
    console.log("  - READMEs se inyectan via el.innerHTML en los props");
    console.log("  - Si el README usa dangerouslySetInnerHTML para renderizar → XSS");
    console.log("  - La defensa principal es el sanitizador SERVER-SIDE");
    console.log("  - Sin CSP o iframe sandbox → un bypass del sanitizador = XSS completo");
    console.log("");
    console.log("HALLAZGO #23 — Open Redirect:");
    console.log("  - load-path.js: redirect via header 'location' sin validar dominio");
    console.log("  - package-linking: redirect via authUrl/href sin validar");
    console.log("  - Requiere control del server response o del Redux state");
    console.log("");
    console.log("=== FIN ===");
}, 3000);
