// src/components/ProtectedRoute.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Alert, Box } from '@mui/material';
import { useAuth } from '../auth/AuthContext';

export default function ProtectedRoute({ requiredPermission }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You must be logged in to access this page.
        </Alert>
      </Box>
    );
  }

  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          You don't have permission to access this page. Required permission: {requiredPermission}
        </Alert>
      </Box>
    );
  }

  return <Outlet />;
}
