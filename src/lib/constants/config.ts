/**
 * API URL configuration
 * Falls back to localhost if EXPO_PUBLIC_URL is not set
 */
export const API_URL = process.env.EXPO_PUBLIC_URL || "http://localhost:8000"; 