// src/store/uiStore.js

import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // State for managing the sidebar on mobile devices
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // State for a global notification banner
  notification: {
    message: '',
    severity: 'info',
    isOpen: false,
  },
  showNotification: (message, severity = 'success') => set({
    notification: { message, severity, isOpen: true }
  }),
  hideNotification: () => set((state) => ({
    notification: { ...state.notification, isOpen: false }
  })),
}));
