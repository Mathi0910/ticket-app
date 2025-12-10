// src/utils/api.js
// Axios instance with robust request interceptor and basic 401 handling.
// Uses VITE_API_URL if present, otherwise falls back to localhost (adjust if needed).

import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://localhost:7257";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: ensure Authorization header is attached reliably.
// - strips stray quotes
// - doesn't duplicate "Bearer " if already present
// - ensures config.headers exists
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    let token = localStorage.getItem("token");

    if (!token && window && window.__TOKEN__) token = window.__TOKEN__;

    if (token) {
      token = token.replace(/^"+|"+$/g, "");
      if (/^Bearer\s+/i.test(token)) {
        config.headers.Authorization = token;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor: optional helpful behavior on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Broadcast a logout/auth-needed event — your AuthContext can listen for this
      try {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(err);
  }
);

export default api;
// // src/utils/api.js
// import axios from "axios";

// const baseURL = import.meta.env.VITE_API_BASE_URL;
// console.log("API base URL:", baseURL);

// const api = axios.create({
//   baseURL,
//   withCredentials: false, // JWT bearer does NOT use cookies
// });

// // =====================
// // REQUEST INTERCEPTOR (UPDATED)
// // =====================
// api.interceptors.request.use(
//   (config) => {
//     // Ensure headers object exists
//     config.headers = config.headers || {};

//     // Try to read token from storage
//     let token = localStorage.getItem("token");

//     // Support cases where someone manually stored `"token"` with extra quotes
//     if (token) {
//       token = token.replace(/^"+|"+$/g, ""); // remove accidental quotes

//       // If token already begins with Bearer, use as-is
//       if (/^Bearer\s+/i.test(token)) {
//         config.headers.Authorization = token;
//       } else {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } else {
//       // Debug message (can be uncommented when investigating 401s)
//       // console.debug("No token found for request:", config.url);
//     }

//     return config;
//   },
//   (err) => Promise.reject(err)
// );

// export default api;

