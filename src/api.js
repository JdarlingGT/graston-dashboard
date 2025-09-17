// src/api.js

const API_BASE_URL = "";

/**
 * A helper function to fetch data from the API gateway.
 * @param {string} endpoint - The path to the API endpoint (e.g., '/events/danger-zone').
 * @param {RequestInit} [options] - Optional fetch options.
 * @returns {Promise<any>} - The JSON response from the API.
 */
async function fetchFromApi(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    throw error; // Re-throw to be handled by the caller
  }
}

// =============================================
// API Functions based on your OpenAPI spec
// =============================================

/**
 * Fetches the event danger zone status.
 * Corresponds to blueprint feature for "At-Risk" Event Flagging[cite: 103].
 */
export const getDangerZoneStatus = () => fetchFromApi("/events/danger-zone");

/**
 * Fetches all WooCommerce products, which are used to represent training events.
 */
export const getEvents = () => fetchFromApi("/woo/products?per_page=100");

/**
 * Fetches all WooCommerce orders to calculate revenue and enrollment trends.
 * This data is used for the Reporting & Analytics module[cite: 96].
 */
export const getOrders = () => fetchFromApi("/woo/orders?per_page=100");

/**
 * Fetches all FluentCRM subscribers (contacts).
 */
export const getAttendees = () => fetchFromApi("/fluent-crm/v2/subscribers?per_page=100");

/**
 * Fetches the system health status.
 */
export const getHealth = () => fetchFromApi("/health");
