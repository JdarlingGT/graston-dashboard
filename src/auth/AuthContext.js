// src/auth/AuthContext.js

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// In a real WordPress app, this user object (especially permissions) would
// be fetched from the backend after the user logs in.
const mockUser = {
  name: 'Training Coordinator',
  permissions: ['gted_manage_events', 'gted_view_analytics', 'gted_bulk_enroll'],
};

export const AuthProvider = ({ children }) => {
  const [user] = useState(mockUser);

  // You can add login/logout functions here later
  const authContextValue = { user };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
