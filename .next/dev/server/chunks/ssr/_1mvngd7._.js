module.exports = [
"[project]/app/check-in/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CheckInPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function CheckInPage() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        loading: true,
        result: null,
        error: ''
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) {
            setState({
                loading: false,
                result: null,
                error: 'This QR code does not contain a registration token.'
            });
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkIn"])(token).then((result)=>setState({
                loading: false,
                result,
                error: ''
            })).catch((error)=>setState({
                loading: false,
                result: null,
                error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(error, 'Unable to verify this registration.')
            }));
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "check-in-shell",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "check-in-card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "check-in-brand",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "check-in-brand-mark",
                            children: "AM"
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 23,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "check-in-brand-text",
                            children: [
                                "Alumni",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/check-in/page.jsx",
                                    lineNumber: 24,
                                    columnNumber: 61
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Meet"
                                }, void 0, false, {
                                    fileName: "[project]/app/check-in/page.jsx",
                                    lineNumber: 24,
                                    columnNumber: 67
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 24,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/check-in/page.jsx",
                    lineNumber: 22,
                    columnNumber: 13
                }, this),
                state.loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "check-in-status check-in-loading",
                    "aria-live": "polite",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "check-in-status-pill",
                            children: "Verifying"
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 29,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Checking entry"
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 30,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Checking the registration and attendee details."
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 31,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/check-in/page.jsx",
                    lineNumber: 28,
                    columnNumber: 17
                }, this) : state.result ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "check-in-status check-in-success",
                    "aria-live": "polite",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "check-in-status-pill success-pill",
                            children: "Attendance confirmed"
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 35,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: state.result.attendee?.name
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 36,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "Checked in for ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: state.result.event_title
                                }, void 0, false, {
                                    fileName: "[project]/app/check-in/page.jsx",
                                    lineNumber: 37,
                                    columnNumber: 39
                                }, this),
                                "."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 37,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "check-in-quiet",
                            children: "Status: Attended"
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 38,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/check-in/page.jsx",
                    lineNumber: 34,
                    columnNumber: 17
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "check-in-status check-in-error",
                    "aria-live": "polite",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "check-in-status-pill danger-pill",
                            children: "Access required"
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 42,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            children: "Unable to check in"
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 43,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "auth-error",
                            children: state.error
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 44,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Sign in as an administrator and scan the QR code again."
                        }, void 0, false, {
                            fileName: "[project]/app/check-in/page.jsx",
                            lineNumber: 45,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/check-in/page.jsx",
                    lineNumber: 41,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/check-in/page.jsx",
            lineNumber: 21,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/check-in/page.jsx",
        lineNumber: 20,
        columnNumber: 12
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
    "getAdminContactMessages",
    ()=>getAdminContactMessages,
    "getAdminOrganizations",
    ()=>getAdminOrganizations,
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
    "getPublicStats",
    ()=>getPublicStats,
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
    "sendContactMessage",
    ()=>sendContactMessage,
    "toggleFollow",
    ()=>toggleFollow,
    "updateAdminContactMessage",
    ()=>updateAdminContactMessage,
    "updateAdminOrganization",
    ()=>updateAdminOrganization,
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
        if (response.status === 429) {
            const retryAfter = response.headers?.get?.('Retry-After');
            throw new Error(retryAfter ? `Too many attempts. Please try again in ${retryAfter} seconds.` : 'Too many attempts. Please wait a moment and try again.');
        }
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
const getPublicStats = ()=>apiRequest('/public/stats/');
const sendContactMessage = (details)=>{
    const form = new FormData();
    Object.entries(details).forEach(([key, value])=>{
        if (value !== null && value !== undefined) form.append(key, value);
    });
    return apiRequest('/contact/', {
        method: 'POST',
        body: form
    });
};
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
const getAdminOrganizations = ()=>apiRequest('/admin/organizations/');
const updateAdminOrganization = (organizationId, details)=>apiRequest(`/admin/organizations/${organizationId}/`, {
        method: 'PATCH',
        body: JSON.stringify(details)
    });
const getAdminContactMessages = ()=>apiRequest('/admin/contact-messages/');
const updateAdminContactMessage = (messageId, status)=>apiRequest(`/admin/contact-messages/${messageId}/`, {
        method: 'PATCH',
        body: JSON.stringify({
            status
        })
    });
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

//# sourceMappingURL=_1mvngd7._.js.map