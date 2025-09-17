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
    // Updated to use FluentCRM subscribers with event_id filter
    queryFn: () => fetchFromApi(`/fluent-crm/v2/subscribers?event_id=${eventId}`),
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

/** Fetches LearnDash users */
export const useLearnDashUsers = () => {
  return useQuery({
    queryKey: ['learndashUsers'],
    queryFn: () => fetchFromApi('/learndash/users'),
  });
};

/** Fetches LearnDash groups */
export const useLearnDashGroups = () => {
  return useQuery({
    queryKey: ['learndashGroups'],
    queryFn: () => fetchFromApi('/learndash/groups'),
  });
};

/** Fetches course progress for a specific user and course */
export const useCourseProgress = (userId, courseId) => {
  return useQuery({
    queryKey: ['courseProgress', userId, courseId],
    queryFn: () => fetchFromApi(`/learndash/course-progress?user_id=${userId}&course_id=${courseId}`),
    enabled: !!userId && !!courseId,
  });
};

/** FluentCRM API Hooks */

/** Fetches all FluentCRM campaigns */
export const useFluentCrmCampaigns = () => {
  return useQuery({
    queryKey: ['fluentCrmCampaigns'],
    queryFn: () => fetchFromApi('/fluent-crm/v2/campaigns'),
  });
};

/** Gravity Forms API Hooks */

/** Fetches all Gravity Forms */
export const useGravityForms = () => {
  return useQuery({
    queryKey: ['gravityForms'],
    queryFn: () => fetchFromApi('/gf/forms'),
  });
};

/** Fetches Gravity Forms entries */
export const useGravityFormsEntries = (formId) => {
  return useQuery({
    queryKey: ['gravityFormsEntries', formId],
    queryFn: () => fetchFromApi(`/gf/entries?form_id=${formId}`),
    enabled: !!formId,
  });
};

/** Fetches Gravity Forms entries summary */
export const useGravityFormsEntriesSummary = () => {
  return useQuery({
    queryKey: ['gravityFormsEntriesSummary'],
    queryFn: () => fetchFromApi('/gf/entries/summary'),
  });
};

/** WordPress API Hooks */

/** Fetches WordPress users */
export const useWordPressUsers = () => {
  return useQuery({
    queryKey: ['wordpressUsers'],
    queryFn: () => fetchFromApi('/wp/v2/users'),
  });
};

/** Fetches WordPress posts */
export const useWordPressPosts = () => {
  return useQuery({
    queryKey: ['wordpressPosts'],
    queryFn: () => fetchFromApi('/wp/v2/posts'),
  });
};

/** ACF API Hooks */

/** Fetches ACF posts */
export const useAcfPosts = () => {
  return useQuery({
    queryKey: ['acfPosts'],
    queryFn: () => fetchFromApi('/acf/posts'),
  });
};

/** Fetches ACF users */
export const useAcfUsers = () => {
  return useQuery({
    queryKey: ['acfUsers'],
    queryFn: () => fetchFromApi('/acf/users'),
  });
};

/** Fetches ACF options */
export const useAcfOptions = () => {
  return useQuery({
    queryKey: ['acfOptions'],
    queryFn: () => fetchFromApi('/acf/options'),
  });
};

/** Automator API Hooks */

/** Fetches Automator recipes */
export const useAutomatorRecipes = () => {
  return useQuery({
    queryKey: ['automatorRecipes'],
    queryFn: () => fetchFromApi('/automator/recipes'),
  });
};

/** Mutation to run an Automator recipe */
export const useRunAutomatorRecipe = () => {
  return useMutation({
    mutationFn: (recipeData) => postToApi('/automator/recipes/run', recipeData),
  });
};

/** Supabase API Hooks */

/** Fetches archived users from Supabase */
export const useArchivedUsers = () => {
  return useQuery({
    queryKey: ['archivedUsers'],
    queryFn: () => fetchFromApi('/supabase/archived-users'),
  });
};

/** Fetches archived orders from Supabase */
export const useArchivedOrders = () => {
  return useQuery({
    queryKey: ['archivedOrders'],
    queryFn: () => fetchFromApi('/supabase/archived-orders'),
  });
};

/** Fetches archived events from Supabase */
export const useArchivedEvents = () => {
  return useQuery({
    queryKey: ['archivedEvents'],
    queryFn: () => fetchFromApi('/supabase/archived-events'),
  });
};

/** WooCommerce API Hooks */

/** Fetches WooCommerce customers */
export const useWooCustomers = () => {
  return useQuery({
    queryKey: ['wooCustomers'],
    queryFn: () => fetchFromApi('/woo/customers?per_page=100'),
  });
};

/** Fetches WooCommerce product categories */
export const useWooCategories = () => {
  return useQuery({
    queryKey: ['wooCategories'],
    queryFn: () => fetchFromApi('/woo/products/categories'),
  });
};

/** Fetches WooCommerce product tags */
export const useWooTags = () => {
  return useQuery({
    queryKey: ['wooTags'],
    queryFn: () => fetchFromApi('/woo/products/tags'),
  });
};

/** Fetches WooCommerce coupons */
export const useWooCoupons = () => {
  return useQuery({
    queryKey: ['wooCoupons'],
    queryFn: () => fetchFromApi('/woo/coupons'),
  });
};

/** Fetches WooCommerce reports */
export const useWooReports = () => {
  return useQuery({
    queryKey: ['wooReports'],
    queryFn: () => fetchFromApi('/woo/reports'),
  });
};

/** Fetches WooCommerce sales reports */
export const useWooSalesReports = () => {
  return useQuery({
    queryKey: ['wooSalesReports'],
    queryFn: () => fetchFromApi('/woo/reports/sales'),
  });
};

/** Fetches WooCommerce top sellers report */
export const useWooTopSellers = () => {
  return useQuery({
    queryKey: ['wooTopSellers'],
    queryFn: () => fetchFromApi('/woo/reports/top_sellers'),
  });
};

/** Fetches WooCommerce variations for a product */
export const useWooProductVariations = (productId) => {
  return useQuery({
    queryKey: ['wooProductVariations', productId],
    queryFn: () => fetchFromApi(`/woo/products/${productId}/variations`),
    enabled: !!productId,
  });
};

/** Fetches WooCommerce reviews */
export const useWooReviews = () => {
  return useQuery({
    queryKey: ['wooReviews'],
    queryFn: () => fetchFromApi('/woo/products/reviews'),
  });
};

/** Fetches WooCommerce shipping zones */
export const useWooShippingZones = () => {
  return useQuery({
    queryKey: ['wooShippingZones'],
    queryFn: () => fetchFromApi('/woo/shipping/zones'),
  });
};

/** Fetches WooCommerce tax rates */
export const useWooTaxRates = () => {
  return useQuery({
    queryKey: ['wooTaxRates'],
    queryFn: () => fetchFromApi('/woo/taxes'),
  });
};

/** Fetches WooCommerce payment gateways */
export const useWooPaymentGateways = () => {
  return useQuery({
    queryKey: ['wooPaymentGateways'],
    queryFn: () => fetchFromApi('/woo/payment_gateways'),
  });
};

/** Fetches WooCommerce settings */
export const useWooSettings = () => {
  return useQuery({
    queryKey: ['wooSettings'],
    queryFn: () => fetchFromApi('/woo/settings'),
  });
};

/** Fetches WooCommerce webhooks */
export const useWooWebhooks = () => {
  return useQuery({
    queryKey: ['wooWebhooks'],
    queryFn: () => fetchFromApi('/woo/webhooks'),
  });
};

/** Mutation hooks for WooCommerce */

/** Creates a new WooCommerce order */
export const useCreateWooOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData) => postToApi('/woo/orders', orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

/** Updates a WooCommerce order */
export const useUpdateWooOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, orderData }) => postToApi(`/woo/orders/${id}`, orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

/** Creates a new WooCommerce product */
export const useCreateWooProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productData) => postToApi('/woo/products', productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/** Updates a WooCommerce product */
export const useUpdateWooProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, productData }) => postToApi(`/woo/products/${id}`, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/** Creates a new WooCommerce customer */
export const useCreateWooCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerData) => postToApi('/woo/customers', customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wooCustomers'] });
    },
  });
};

/** Creates a new WooCommerce coupon */
export const useCreateWooCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (couponData) => postToApi('/woo/coupons', couponData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wooCoupons'] });
    },
  });
};

/** Fetches instrument purchase data for a single event, based on the new spec */
export const useInstrumentData = (eventId) => {
  return useQuery({
    queryKey: ['instrumentData', eventId],
    queryFn: () => fetchFromApi(`/graston/v1/events/${eventId}/instruments`),
    enabled: !!eventId, // This query will only run if an eventId is provided
  });
};
