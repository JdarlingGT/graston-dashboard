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

/** Fetches all events (WooCommerce Products via Worker) */
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
    queryFn: () => fetchFromApi(`/fluent-crm/v2/subscribers?event_id=${eventId}`),
    enabled: !!eventId,
  });
};

/** Fetches instrument purchase data for a single event */
export const useInstrumentData = (eventId) => {
  return useQuery({
    queryKey: ['instrumentData', eventId],
    queryFn: () => fetchFromApi(`/graston/v1/events/${eventId}/instruments`),
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
    mutationFn: (enrollmentData) => postToApi('/fluent-crm/v2/subscribers', enrollmentData),
    onSuccess: (data, variables) => {
      // When enrollment is successful, invalidate the roster query to trigger an automatic refresh
      queryClient.invalidateQueries({ queryKey: ['eventRoster', variables.eventId] });
    },
  });
};

/** LearnDash API Hooks */

/** Fetches all LearnDash courses */
export const useLearnDashCourses = () => {
  return useQuery({
    queryKey: ['learndashCourses'],
    queryFn: () => fetchFromApi('/learndash/courses'),
  });
};

/** Fetches LearnDash user progress */
export const useLearnDashUserProgress = (userId) => {
  return useQuery({
    queryKey: ['learndashUserProgress', userId],
    queryFn: () => fetchFromApi(`/learndash/users/${userId}/progress`),
    enabled: !!userId,
  });
};

/** Fetches CEU compliance data */
export const useCEUCompliance = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: ['ceuCompliance', filters],
    queryFn: () => fetchFromApi(`/insights?q=ceu compliance${queryString ? `&${queryString}` : ''}`),
  });
};

/** WooCommerce API Hooks */

/** Fetches WooCommerce orders with filtering */
export const useWooOrders = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: ['wooOrders', filters],
    queryFn: () => fetchFromApi(`/woo/orders${queryString ? `?${queryString}` : ''}`),
  });
};

/** Fetches WooCommerce products */
export const useWooProducts = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: ['wooProducts', filters],
    queryFn: () => fetchFromApi(`/woo/products${queryString ? `?${queryString}` : ''}`),
  });
};

/** FluentCRM API Hooks */

/** Fetches FluentCRM subscribers with filtering */
export const useFluentCRMSubscribers = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: ['fluentCRMSubscribers', filters],
    queryFn: () => fetchFromApi(`/fluent-crm/v2/subscribers${queryString ? `?${queryString}` : ''}`),
  });
};

/** Fetches FluentCRM tags */
export const useFluentCRMTags = () => {
  return useQuery({
    queryKey: ['fluentCRMTags'],
    queryFn: () => fetchFromApi('/fluent-crm/v2/tags'),
  });
};

/** Gravity Forms API Hooks */

/** Fetches Gravity Forms entries */
export const useGravityFormsEntries = (formId, filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: ['gravityFormsEntries', formId, filters],
    queryFn: () => fetchFromApi(`/gf/v2/forms/${formId}/entries${queryString ? `?${queryString}` : ''}`),
    enabled: !!formId,
  });
};

/** WordPress API Hooks */

/** Fetches WordPress posts/pages */
export const useWordPressPosts = (postType = 'posts', filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: ['wordpressPosts', postType, filters],
    queryFn: () => fetchFromApi(`/wp/v2/${postType}${queryString ? `?${queryString}` : ''}`),
  });
};

/** Automator API Hooks */

/** Fetches Automator recipes */
export const useAutomatorRecipes = () => {
  return useQuery({
    queryKey: ['automatorRecipes'],
    queryFn: () => fetchFromApi('/automator/v2/recipes'),
  });
};

/** Fetches Automator logs */
export const useAutomatorLogs = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: ['automatorLogs', filters],
    queryFn: () => fetchFromApi(`/automator/v2/logs${queryString ? `?${queryString}` : ''}`),
  });
};

/** Engagement Insights API Hooks */

/** Fetches engagement scoring data */
export const useEngagementScoring = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: ['engagementScoring', filters],
    queryFn: () => fetchFromApi(`/insights?q=engagement scoring${queryString ? `&${queryString}` : ''}`),
  });
};

/** Fetches customer risk assessment */
export const useCustomerRiskAssessment = (customerId) => {
  return useQuery({
    queryKey: ['customerRisk', customerId],
    queryFn: () => fetchFromApi(`/insights/customer/${customerId}/risk`),
    enabled: !!customerId,
  });
};

/** Certification Pipeline API Hooks */

/** Fetches certification eligibility */
export const useCertificationEligibility = (userId) => {
  return useQuery({
    queryKey: ['certificationEligibility', userId],
    queryFn: () => fetchFromApi(`/insights/user/${userId}/certification`),
    enabled: !!userId,
  });
};

/** Fetches certification pipeline status */
export const useCertificationPipeline = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: ['certificationPipeline', filters],
    queryFn: () => fetchFromApi(`/insights?q=certification pipeline${queryString ? `&${queryString}` : ''}`),
  });
};

/** Mutation Hooks for Data Operations */

/** Bulk enrollment mutation */
export const useBulkEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bulkData) => postToApi('/fluent-crm/v2/subscribers/bulk', bulkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventRoster'] });
      queryClient.invalidateQueries({ queryKey: ['attendees'] });
    },
  });
};

/** Update customer tags mutation */
export const useUpdateCustomerTags = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, tags }) => postToApi(`/fluent-crm/v2/subscribers/${customerId}/tags`, { tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fluentCRMSubscribers'] });
      queryClient.invalidateQueries({ queryKey: ['attendees'] });
    },
  });
};

/** Trigger CRM sequence mutation */
export const useTriggerCRMSequence = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sequenceId, subscriberIds }) => postToApi('/fluent-crm/v2/sequences/trigger', { sequenceId, subscriberIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fluentCRMSubscribers'] });
    },
  });
};

/** Send bulk email mutation */
export const useSendBulkEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (emailData) => postToApi('/fluent-crm/v2/emails/bulk', emailData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fluentCRMSubscribers'] });
    },
  });
};
