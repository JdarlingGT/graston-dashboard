import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './auth/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import OrdersPage from './pages/OrdersPage';
import CEUCompliancePage from './pages/CEUCompliancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AttendeesPage from './pages/AttendeesPage';
import LearnDashPage from './pages/LearnDashPage';
import FluentCrmPage from './pages/FluentCrmPage';
import GravityFormsPage from './pages/GravityFormsPage';
import WooCommercePage from './pages/WooCommercePage';
import { darkTheme } from './theme/theme'; // Import the new theme

// Create a client for TanStack Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}> {/* Use the custom theme */}
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />

                {/* Protected Routes for Event Management */}
                <Route element={<ProtectedRoute requiredPermission="gted_manage_events" />}>
                  <Route path="events" element={<EventsPage />} />
                  <Route path="events/:eventId/roster" element={<EventDetailPage />} />
                  <Route path="attendees" element={<AttendeesPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="ceu-compliance" element={<CEUCompliancePage />} />
                </Route>

                {/* Protected Route for Analytics */}
                <Route element={<ProtectedRoute requiredPermission="gted_view_analytics" />}>
                   <Route path="analytics" element={<AnalyticsPage />} />
                </Route>

                {/* Additional Management Routes */}
                <Route element={<ProtectedRoute requiredPermission="gted_manage_events" />}>
                  <Route path="learndash" element={<LearnDashPage />} />
                  <Route path="fluentcrm" element={<FluentCrmPage />} />
                  <Route path="gravityforms" element={<GravityFormsPage />} />
                  <Route path="woocommerce" element={<WooCommercePage />} />
                </Route>

              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
