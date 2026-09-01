module.exports = [
"[project]/app/register/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RegisterPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function RegisterPage() {
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        email: '',
        password: '',
        tenant_id: '',
        role_id: ''
    });
    const [roles, setRoles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loadingRoles, setLoadingRoles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function loadRoles() {
            try {
                const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:8000/api") || 'https://alumnibackendapi.vercel.app/api'}/auth/roles/`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Could not load membership roles');
                }
                const data = await response.json();
                const options = (data.roles || []).filter((role)=>role.code === 'alumni' || role.code === 'student');
                setRoles(options);
                if (options[0]) setForm((current)=>({
                        ...current,
                        role_id: current.role_id || options[0].id
                    }));
            } catch  {
                setRoles([
                    {
                        id: 'alumni',
                        code: 'alumni',
                        name: 'Alumni'
                    },
                    {
                        id: 'student',
                        code: 'student',
                        name: 'Student'
                    }
                ]);
            } finally{
                setLoadingRoles(false);
            }
        }
        loadRoles();
    }, []);
    async function submit(event) {
        event.preventDefault();
        setError('');
        setBusy(true);
        try {
            const payload = {
                ...form,
                name: form.name.trim(),
                email: form.email.trim(),
                tenant_id: form.tenant_id.trim(),
                role_id: form.role_id
            };
            if (!payload.name || payload.name.length < 2) {
                throw new Error('Please enter your full name.');
            }
            if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
                throw new Error('Please enter a valid email address.');
            }
            if (!payload.tenant_id) {
                throw new Error('Please enter your college or tenant code.');
            }
            if (!payload.role_id) {
                throw new Error('Please choose a role.');
            }
            if (payload.password.length < 8) {
                throw new Error('Password must be at least 8 characters long.');
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerAccount"])(payload);
            window.location.assign('/login');
        } catch (err) {
            setError((0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(err, 'Unable to create your account right now.'));
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "auth-shell",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "auth-card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "auth-logo",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "auth-logo-mark",
                            children: "AM"
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.jsx",
                            lineNumber: 72,
                            columnNumber: 97
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Alumni",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/register/page.jsx",
                                    lineNumber: 72,
                                    columnNumber: 151
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Meet"
                                }, void 0, false, {
                                    fileName: "[project]/app/register/page.jsx",
                                    lineNumber: 72,
                                    columnNumber: 157
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/register/page.jsx",
                            lineNumber: 72,
                            columnNumber: 139
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/register/page.jsx",
                    lineNumber: 72,
                    columnNumber: 70
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: "Join the hallway"
                }, void 0, false, {
                    fileName: "[project]/app/register/page.jsx",
                    lineNumber: 72,
                    columnNumber: 191
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Create your alumni profile and join your institution community."
                }, void 0, false, {
                    fileName: "[project]/app/register/page.jsx",
                    lineNumber: 72,
                    columnNumber: 216
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: submit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "Full name",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    required: true,
                                    minLength: "2",
                                    value: form.name,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            name: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/app/register/page.jsx",
                                    lineNumber: 72,
                                    columnNumber: 326
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/register/page.jsx",
                            lineNumber: 72,
                            columnNumber: 310
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "Email",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    required: true,
                                    value: form.email,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            email: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/app/register/page.jsx",
                                    lineNumber: 72,
                                    columnNumber: 465
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/register/page.jsx",
                            lineNumber: 72,
                            columnNumber: 453
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "College or tenant code",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    required: true,
                                    minLength: "2",
                                    placeholder: "e.g. northview",
                                    value: form.tenant_id,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            tenant_id: event.target.value.trim()
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/app/register/page.jsx",
                                    lineNumber: 72,
                                    columnNumber: 622
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/register/page.jsx",
                            lineNumber: 72,
                            columnNumber: 593
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "Role",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: form.role_id,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            role_id: event.target.value
                                        }),
                                    disabled: loadingRoles || roles.length === 0,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select your role"
                                        }, void 0, false, {
                                            fileName: "[project]/app/register/page.jsx",
                                            lineNumber: 72,
                                            columnNumber: 953
                                        }, this),
                                        roles.map((role)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: role.id,
                                                children: role.name
                                            }, role.id, false, {
                                                fileName: "[project]/app/register/page.jsx",
                                                lineNumber: 72,
                                                columnNumber: 1016
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/register/page.jsx",
                                    lineNumber: 72,
                                    columnNumber: 806
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/register/page.jsx",
                            lineNumber: 72,
                            columnNumber: 795
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "Password",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    required: true,
                                    minLength: "8",
                                    value: form.password,
                                    onChange: (event)=>setForm({
                                            ...form,
                                            password: event.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/app/register/page.jsx",
                                    lineNumber: 72,
                                    columnNumber: 1108
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/register/page.jsx",
                            lineNumber: 72,
                            columnNumber: 1093
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "auth-error",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.jsx",
                            lineNumber: 72,
                            columnNumber: 1269
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "auth-submit",
                            disabled: busy || loadingRoles,
                            children: busy ? 'Creating account...' : 'Create account'
                        }, void 0, false, {
                            fileName: "[project]/app/register/page.jsx",
                            lineNumber: 72,
                            columnNumber: 1307
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/register/page.jsx",
                    lineNumber: 72,
                    columnNumber: 286
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    className: "auth-link",
                    href: "/login",
                    children: "Already have an account? Sign in"
                }, void 0, false, {
                    fileName: "[project]/app/register/page.jsx",
                    lineNumber: 72,
                    columnNumber: 1436
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/register/page.jsx",
            lineNumber: 72,
            columnNumber: 39
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/register/page.jsx",
        lineNumber: 72,
        columnNumber: 10
    }, this);
}
}),
"[project]/services/api.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminEvents",
    ()=>adminEvents,
    "adminPeople",
    ()=>adminPeople,
    "apiRequest",
    ()=>apiRequest,
    "cancelRsvp",
    ()=>cancelRsvp,
    "changePassword",
    ()=>changePassword,
    "checkIn",
    ()=>checkIn,
    "createTenant",
    ()=>createTenant,
    "deleteEvent",
    ()=>deleteEvent,
    "deletePerson",
    ()=>deletePerson,
    "downloadAttendanceCsv",
    ()=>downloadAttendanceCsv,
    "getAlumni",
    ()=>getAlumni,
    "getAlumniProfile",
    ()=>getAlumniProfile,
    "getAnalytics",
    ()=>getAnalytics,
    "getAttendance",
    ()=>getAttendance,
    "getErrorMessage",
    ()=>getErrorMessage,
    "getEvent",
    ()=>getEvent,
    "getEvents",
    ()=>getEvents,
    "getMyEvents",
    ()=>getMyEvents,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "refreshSession",
    ()=>refreshSession,
    "registerAccount",
    ()=>registerAccount,
    "requestPasswordOtp",
    ()=>requestPasswordOtp,
    "resetPassword",
    ()=>resetPassword,
    "rsvp",
    ()=>rsvp,
    "toggleFollow",
    ()=>toggleFollow,
    "updateEvent",
    ()=>updateEvent,
    "updatePerson",
    ()=>updatePerson,
    "updateProfile",
    ()=>updateProfile,
    "uploadEventBanner",
    ()=>uploadEventBanner,
    "uploadProfileImages",
    ()=>uploadProfileImages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/auth.js [app-ssr] (ecmascript)");
;
function normalizeApiBase(value) {
    const fallback = 'https://alumnibackendapi.vercel.app/api';
    const raw = (value || fallback).trim();
    try {
        const url = new URL(raw);
        let path = (url.pathname || '').replace(/\/+$/, '');
        path = path.replace(/\/auth\/login$/i, '');
        if (!path || path === '/') path = '/api';
        return `${url.origin}${path}`;
    } catch  {
        return fallback;
    }
}
const API_URL = normalizeApiBase(("TURBOPACK compile-time value", "http://localhost:8000/api"));
function getErrorMessage(error, fallback = 'Request failed') {
    if (!error) return fallback;
    if (typeof error === 'string') return error.trim() || fallback;
    if (error.detail) return error.detail;
    if (error.message) return error.message;
    return fallback;
}
async function apiRequest(path, options = {}) {
    const { _retried, ...requestOptions } = options;
    const method = (options.method || 'GET').toUpperCase();
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])();
    let csrfToken = typeof document !== 'undefined' ? document.cookie.split('; ').find((item)=>item.startsWith('csrftoken='))?.split('=')[1] : null;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const isFormData = typeof FormData !== 'undefined' && requestOptions.body instanceof FormData;
    const response = await fetch(`${API_URL}${path}`, {
        ...requestOptions,
        credentials: 'include',
        headers: {
            ...isFormData ? {} : {
                'Content-Type': 'application/json'
            },
            ...csrfToken ? {
                'X-CSRFToken': csrfToken
            } : {},
            ...accessToken ? {
                Authorization: `Bearer ${accessToken}`
            } : {},
            ...requestOptions.headers
        }
    });
    if (response.status === 401 && !_retried && path !== '/auth/refresh/') {
        const refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRefreshToken"])();
        const refreshResponse = await fetch(`${API_URL}/auth/refresh/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                ...csrfToken ? {
                    'X-CSRFToken': csrfToken
                } : {},
                'Content-Type': 'application/json',
                ...refreshToken ? {
                    Authorization: `Bearer ${refreshToken}`
                } : {}
            },
            body: JSON.stringify(refreshToken ? {
                refresh_token: refreshToken
            } : {})
        });
        if (refreshResponse.ok) {
            const refreshed = await refreshResponse.json().catch(()=>({}));
            if (refreshed.access_token || refreshed.refresh_token) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSession"])({
                    access_token: refreshed.access_token || accessToken,
                    refresh_token: refreshed.refresh_token || refreshToken
                });
            }
            return apiRequest(path, {
                ...requestOptions,
                _retried: true
            });
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearSession"])();
    }
    if (response.status === 204 || response.status === 205) {
        return {};
    }
    const contentType = response.headers?.get?.('content-type') || '';
    const hasJsonReader = typeof response.json === 'function';
    const hasTextReader = typeof response.text === 'function';
    const isJson = contentType.includes('application/json') || hasJsonReader && !hasTextReader;
    const data = isJson ? await response.json().catch(()=>({})) : hasTextReader ? await response.text() : {};
    if (!response.ok) {
        if (isJson && data && typeof data === 'object') throw new Error(getErrorMessage(data, 'Request failed'));
        throw new Error(typeof data === 'string' && data.trim() || 'Request failed');
    }
    return isJson ? data : {
        value: data
    };
}
async function refreshSession() {
    const refreshed = await apiRequest('/auth/refresh/', {
        method: 'POST'
    });
    if (refreshed.access_token || refreshed.refresh_token) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSession"])({
            access_token: refreshed.access_token || (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])(),
            refresh_token: refreshed.refresh_token || (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRefreshToken"])()
        });
    }
    return refreshed;
}
async function login(credentials) {
    const result = await apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
    if (result.access_token || result.refresh_token) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSession"])({
            access_token: result.access_token || null,
            refresh_token: result.refresh_token || null
        });
    }
    return result;
}
const requestPasswordOtp = (email)=>apiRequest('/auth/password/forgot/', {
        method: 'POST',
        body: JSON.stringify({
            email
        })
    });
const resetPassword = (details)=>apiRequest('/auth/password/reset/', {
        method: 'POST',
        body: JSON.stringify(details)
    });
const changePassword = (details)=>apiRequest('/auth/password/change/', {
        method: 'POST',
        body: JSON.stringify(details)
    });
async function registerAccount(details) {
    return apiRequest('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(details)
    });
}
async function createTenant(details) {
    return apiRequest('/tenants/', {
        method: 'POST',
        body: JSON.stringify(details)
    });
}
const logout = async ()=>{
    try {
        return await apiRequest('/auth/logout/', {
            method: 'POST'
        });
    } finally{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearSession"])();
    }
};
const getEvents = (params = {})=>{
    const query = new URLSearchParams(Object.entries(params).filter(([, value])=>value));
    return apiRequest(`/events/${query.toString() ? `?${query}` : ''}`);
};
const getEvent = (eventId)=>apiRequest(`/events/${eventId}/`);
const getAlumni = (page = 1)=>apiRequest(`/alumni/?page=${page}`);
const getAlumniProfile = (personId)=>apiRequest(`/alumni/${personId}/`);
const toggleFollow = (personId)=>apiRequest(`/alumni/${personId}/follow/`, {
        method: 'POST'
    });
const rsvp = (eventId)=>apiRequest(`/events/${eventId}/register/`, {
        method: 'POST'
    });
const cancelRsvp = (eventId)=>apiRequest(`/events/${eventId}/register/`, {
        method: 'POST',
        body: JSON.stringify({
            status: 'cancelled'
        })
    });
const getMyEvents = ()=>apiRequest('/my-events/');
const getAttendance = ()=>apiRequest('/admin/attendance/');
const getAnalytics = ()=>apiRequest('/admin/analytics/');
const updatePerson = (personId, person)=>apiRequest(`/admin/people/${personId}/`, {
        method: 'PUT',
        body: JSON.stringify(person)
    });
async function downloadAttendanceCsv() {
    const response = await fetch(`${API_URL}/admin/attendance/?download=csv`, {
        credentials: 'include'
    });
    if (!response.ok) {
        const data = await response.json().catch(()=>({}));
        throw new Error(data.detail || 'Attendance export failed');
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'attendance.csv';
    link.click();
    URL.revokeObjectURL(url);
}
const checkIn = (token)=>apiRequest('/admin/events/check-in/', {
        method: 'POST',
        body: JSON.stringify({
            token
        })
    });
const updateProfile = (profile)=>apiRequest('/auth/profile/', {
        method: 'PUT',
        body: JSON.stringify(profile)
    });
const uploadProfileImages = (files)=>{
    const form = new FormData();
    Object.entries(files).forEach(([name, file])=>{
        if (file) form.append(name, file);
    });
    return apiRequest('/auth/profile/images/', {
        method: 'POST',
        body: form
    });
};
const adminPeople = ()=>apiRequest('/admin/people/');
const adminEvents = (event)=>apiRequest('/events/', {
        method: 'POST',
        body: JSON.stringify(event)
    });
const updateEvent = (eventId, event)=>apiRequest(`/admin/events/${eventId}/`, {
        method: 'PUT',
        body: JSON.stringify(event)
    });
const uploadEventBanner = (file)=>{
    const form = new FormData();
    form.append('banner_image', file);
    return apiRequest('/admin/events/upload-banner/', {
        method: 'POST',
        body: form
    });
};
const deleteEvent = (eventId)=>apiRequest(`/admin/events/${eventId}/`, {
        method: 'DELETE'
    });
const deletePerson = (personId)=>apiRequest(`/admin/people/${personId}/`, {
        method: 'DELETE'
    });
}),
];

//# sourceMappingURL=_1l6w-4y._.js.map