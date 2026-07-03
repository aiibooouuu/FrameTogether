/**
 * ==========================================================
 * FrameTogether
 * API Configuration
 * ==========================================================
 */


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

console.log("API URL =", API_BASE_URL);

export default API_BASE_URL;