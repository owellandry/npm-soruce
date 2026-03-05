// ================================================================
// PoC: Inspeccionar el formulario de escalación real
// ================================================================
// EJECUTAR EN: https://www.npmjs.com/package/openvite/delete
// (logueado como owellandry)
//
// Objetivo: Ver exactamente qué campos envía el form de escalación
// para entender si podemos determinar el nombre del campo password
// ================================================================

console.log("=== Inspección del Form de Escalación ===\n");
console.log(`[*] URL actual: ${window.location.href}`);
console.log(`[*] Usuario: ${window.__context__?.user?.name || 'desconocido'}\n`);

// 1. Analizar todos los forms en la página
const forms = document.querySelectorAll('form');
console.log(`[+] Formularios encontrados: ${forms.length}\n`);

forms.forEach((form, i) => {
    console.log(`═══ Form #${i} ═══`);
    console.log(`  action: "${form.action}"`);
    console.log(`  method: "${form.method}"`);
    console.log(`  id: "${form.id}"`);
    console.log(`  class: "${form.className}"`);

    // Inputs
    const inputs = form.querySelectorAll('input, select, textarea, button');
    console.log(`  Campos (${inputs.length}):`);
    inputs.forEach(input => {
        const tag = input.tagName.toLowerCase();
        const type = input.type || '';
        const name = input.name || '';
        const id = input.id || '';
        const placeholder = input.placeholder || '';
        const value = type === 'password' ? '***' :
                      name === 'csrftoken' ? input.value.substring(0, 15) + '...' :
                      input.value || '';
        console.log(`    <${tag}> type="${type}" name="${name}" id="${id}" placeholder="${placeholder}" value="${value}"`);
    });

    // Labels
    const labels = form.querySelectorAll('label');
    labels.forEach(label => {
        console.log(`    <label> for="${label.htmlFor}" text="${label.textContent.trim()}"`);
    });

    console.log('');
});

// 2. Analizar __context__ para datos del form
console.log("═══ Datos de __context__ relevantes ═══\n");
const ctx = window.__context__ || {};
const relevantKeys = ['escalateType', 'action', 'originalUrl', 'errorCount',
                      'hasTotp', 'hasWebAuthnDevices', 'disable2faPasswordOption',
                      'formData', 'deleteAction', 'unpublishAction'];
for (const key of relevantKeys) {
    if (ctx[key] !== undefined) {
        console.log(`  ${key}: ${JSON.stringify(ctx[key])}`);
    }
}

// 3. Interceptar el submit del form para ver qué datos envía
console.log("\n═══ Interceptando envío de formulario ═══\n");

forms.forEach((form, i) => {
    const originalSubmit = form.onsubmit;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log(`\n[!!!] FORMULARIO #${i} INTERCEPTADO (submit bloqueado)`);
        console.log(`  action: ${form.action}`);
        console.log(`  method: ${form.method}`);

        const formData = new FormData(form);
        console.log(`  Datos enviados:`);
        for (const [key, value] of formData.entries()) {
            if (key === 'password') {
                console.log(`    ${key}: *** (${value.length} chars)`);
            } else if (key === 'csrftoken') {
                console.log(`    ${key}: ${value.substring(0, 15)}...`);
            } else {
                console.log(`    ${key}: ${value}`);
            }
        }

        console.log(`\n[*] El submit fue BLOQUEADO. No se envió nada.`);
        console.log(`[*] Si quieres enviar realmente, recarga la página.`);
    }, true);
    console.log(`[+] Form #${i} interceptado - el submit será capturado y bloqueado`);
});

// 4. Buscar event listeners de React en botones
console.log("\n═══ Botones y enlaces de acción ═══\n");
const buttons = document.querySelectorAll('button, [role="button"], input[type="submit"]');
buttons.forEach(btn => {
    console.log(`  <${btn.tagName.toLowerCase()}> type="${btn.type}" text="${btn.textContent.trim().substring(0, 50)}" class="${btn.className.substring(0, 60)}"`);
});

// 5. Si hay React, buscar el state del componente de escalación
console.log("\n═══ Estructura de la página ═══\n");
const mainContent = document.querySelector('#main, main, [role="main"], .container');
if (mainContent) {
    // Buscar headings
    const headings = mainContent.querySelectorAll('h1, h2, h3');
    headings.forEach(h => console.log(`  ${h.tagName}: "${h.textContent.trim()}"`));

    // Buscar textos que mencionen "password", "delete", etc.
    const allText = mainContent.innerText;
    const lines = allText.split('\n').filter(l => l.trim());
    const relevant = lines.filter(l =>
        /password|delete|remove|unpublish|confirm|escalat|verify/i.test(l)
    );
    if (relevant.length > 0) {
        console.log("\n  Textos relevantes en la página:");
        relevant.forEach(l => console.log(`    "${l.trim()}"`));
    }
}

// 6. Interceptar fetch/XMLHttpRequest para capturar la petición real
console.log("\n═══ Interceptando fetch() ═══\n");

const originalFetch = window.fetch;
window.fetch = async function(...args) {
    const [url, options] = args;
    const urlStr = typeof url === 'string' ? url : url?.url || '';

    if (urlStr.includes('escalate') || urlStr.includes('delete') || urlStr.includes('unpublish')) {
        console.log(`\n[!!!] FETCH INTERCEPTADO:`);
        console.log(`  URL: ${urlStr}`);
        console.log(`  Method: ${options?.method || 'GET'}`);
        console.log(`  Headers: ${JSON.stringify(Object.fromEntries(Object.entries(options?.headers || {})))}`);

        if (options?.body) {
            try {
                const body = JSON.parse(options.body);
                const sanitized = { ...body };
                if (sanitized.password) sanitized.password = `*** (${body.password.length} chars)`;
                if (sanitized.csrftoken) sanitized.csrftoken = sanitized.csrftoken.substring(0, 15) + '...';
                console.log(`  Body: ${JSON.stringify(sanitized)}`);
            } catch {
                console.log(`  Body (raw): ${options.body.substring(0, 200)}`);
            }
        }
    }

    return originalFetch.apply(this, args);
};
console.log("[+] fetch() interceptado - cualquier petición a escalate/delete será logueada");

console.log("\n=== LISTO ===");
console.log("Ahora puedes intentar llenar y enviar el formulario.");
console.log("El submit del form HTML está BLOQUEADO, pero si React usa");
console.log("fetch() directamente, verás la petición en la consola.");
console.log("NO se bloqueará el fetch, solo se logueará.");
