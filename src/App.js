import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './auth/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AttendeesPage from './pages/AttendeesPage';

// Create a client for TanStack Query
const queryClient = new QueryClient();

// A modern, dark theme for the dashboard
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
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
                </Route>

                {/* Protected Route for Analytics */}
                <Route element={<ProtectedRoute requiredPermission="gted_view_analytics" />}>
                   <Route path="analytics" element={<AnalyticsPage />} />
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
