// src/hooks/useApi.js

import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = ""; // Using proxy for development

/**
 * A helper function to fetch data from the API gateway.
 * @param {string} endpoint - The path to the API endpoint (e.g., '/events/danger-zone').
 * @returns {Promise<any>} - The JSON response from the API.
 */
const fetchFromApi = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText} on ${endpoint}`);
  }
  return response.json();
};

// =============================================
// React Query Hooks for API Endpoints
// =============================================

/** Fetches the event danger zone status */
export const useDangerZoneStatus = () => {
  return useQuery({
    queryKey: ['dangerZone'],
    queryFn: () => fetchFromApi('/events/danger-zone'),
  });
};

/** Fetches all events (LearnDash Groups / WooCommerce Products) */
export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => fetchFromApi('/woo/products?per_page=100'),
  });
};

/** Fetches the detailed student roster for a single event */
export const useEventRoster = (eventId) => {
  return useQuery({
    queryKey: ['eventRoster', eventId],
    queryFn: () => fetchFromApi(`/events/${eventId}/attendees`),
    enabled: !!eventId, // Only run the query if eventId is available
  });
};

/** Fetches all orders for analytics */
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => fetchFromApi('/woo/orders?per_page=100'),
  });
};

/** Fetches all attendees/subscribers */
export const useAttendees = () => {
  return useQuery({
    queryKey: ['attendees'],
    queryFn: () => fetchFromApi('/fluent-crm/v2/subscribers?per_page=100'),
  });
};

/** Fetches system health status */
export const useHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => fetchFromApi('/health'),
  });
};
