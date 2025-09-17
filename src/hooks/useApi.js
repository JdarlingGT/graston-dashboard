// src/hooks/useApi.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// The proxy in package.json handles the base URL during development
const API_BASE_URL = "";

const fetchFromApi = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText} on ${endpoint}`);
  }
  return response.json();
};

const postToApi = async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
};

/** Fetches the event danger zone status */
export const useDangerZoneStatus = () => {
  return useQuery({
    queryKey: ['dangerZone'],
    queryFn: () => fetchFromApi('/events/danger-zone'),
  });
};

/** Fetches all events (WooCommerce Products) */
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
    // This uses the custom endpoint from your blueprint for detailed roster data
    queryFn: () => fetchFromApi(`/gted/v1/events/${eventId}/attendees`),
    enabled: !!eventId,
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

/** A mutation hook for manually enrolling a single participant */
export const useSingleEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentData) => postToApi('/gted/v1/attendees/single-enroll', enrollmentData),
    onSuccess: (data, variables) => {
      // When enrollment is successful, invalidate the roster query to trigger an automatic refresh
      queryClient.invalidateQueries({ queryKey: ['eventRoster', variables.eventId] });
    },
  });
};
