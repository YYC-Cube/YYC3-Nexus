import { useCallback, useMemo } from 'react';

import { useApp } from '../context/app-context';
import { useAuth } from '../context/auth-context';

type PageId = string;

const PAGE_PERMISSIONS: Record<string, string[]> = {
  compensation: ['admin.billing'],
  finance: ['admin.billing'],
  settings: ['system.settings'],
  modelSettings: ['system.apikeys'],
  parameterSettings: ['system.settings'],
  platformSettings: ['system.settings'],
};

export function useRouteGuard() {
  const { activePage } = useApp();
  const { hasAnyPermission, role, isAuthenticated } = useAuth();

  const requiredPermissions = useMemo(() => PAGE_PERMISSIONS[activePage] || [], [activePage]);

  const isAuthorized = useMemo(() => {
    if (!isAuthenticated) return false;
    if (role === 'admin') return true;
    if (requiredPermissions.length === 0) return true;
    return hasAnyPermission(requiredPermissions);
  }, [isAuthenticated, role, requiredPermissions, hasAnyPermission]);

  const checkAccess = useCallback(
    (pageId: PageId): { allowed: boolean; reason?: string } => {
      const perms = PAGE_PERMISSIONS[pageId];
      if (!perms || perms.length === 0) return { allowed: true };
      if (role === 'admin') return { allowed: true };
      if (!isAuthenticated) return { allowed: false, reason: '未登录' };
      if (!hasAnyPermission(perms)) return { allowed: false, reason: '权限不足' };
      return { allowed: true };
    },
    [role, isAuthenticated, hasAnyPermission],
  );

  return { isAuthorized, requiredPermissions, checkAccess, activePage };
}
