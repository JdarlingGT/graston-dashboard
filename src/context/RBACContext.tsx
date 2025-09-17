import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Permission = 'read' | 'write' | 'delete' | 'admin';

interface RBACContextType {
  hasPermission: (permission: Permission, resource?: string) => boolean;
  userRole: string | null;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

interface RBACProviderProps {
  children: ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission, resource?: string): boolean => {
    if (!user) return false;

    // Resource-specific permissions can be implemented here
    // For now, we only check role-based permissions
    if (resource) {
      console.log(`Checking permission for resource: ${resource}`);
    }

    const rolePermissions: Record<string, Permission[]> = {
      admin: ['read', 'write', 'delete', 'admin'],
      manager: ['read', 'write'],
      user: ['read'],
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  const value = {
    hasPermission,
    userRole: user?.role || null,
  };

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};
