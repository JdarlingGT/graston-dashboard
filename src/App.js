import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage'; // New component for single event view
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
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="events" element={<EventsPage />} />
              {/* This route handles the detailed student roster for a specific event */}
              <Route path="events/:eventId/roster" element={<EventDetailPage />} />
              <Route path="attendees" element={<AttendeesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
