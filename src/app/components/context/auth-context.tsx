import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface Permission {
  id: string;
  label: string;
  description: string;
  category: 'data' | 'system' | 'admin' | 'export';
}

interface AuthState {
  isAuthenticated: boolean;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
}

interface AuthContextValue extends AuthState {
  login: (role: AuthState['role']) => void;
  logout: () => void;
  hasPermission: (permissionId: string) => boolean;
  hasAnyPermission: (permissionIds: string[]) => boolean;
}

const PERMISSIONS: Permission[] = [
  { id: 'data.view', label: '查看数据', description: '查看仪表盘和报表数据', category: 'data' },
  { id: 'data.export', label: '导出数据', description: '导出CSV/JSON数据', category: 'data' },
  { id: 'system.settings', label: '系统设置', description: '修改系统配置参数', category: 'system' },
  { id: 'system.apikeys', label: 'API密钥', description: '管理AI模型API密钥', category: 'system' },
  { id: 'admin.users', label: '用户管理', description: '管理用户角色和权限', category: 'admin' },
  { id: 'admin.billing', label: '财务管理', description: '查看薪酬和财务数据', category: 'admin' },
  { id: 'export.all', label: '全量导出', description: '导出所有业务数据', category: 'export' },
];

const ROLE_PERMISSIONS: Record<AuthState['role'], string[]> = {
  admin: PERMISSIONS.map(p => p.id),
  editor: ['data.view', 'data.export', 'export.all'],
  viewer: ['data.view'],
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'yyc3-auth-state';

function loadState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthState;
      if (parsed.role && parsed.permissions) return parsed;
    }
  } catch {
    // invalid JSON
  }
  return { isAuthenticated: true, role: 'admin', permissions: ROLE_PERMISSIONS.admin };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(loadState);

  const login = useCallback((role: AuthState['role']) => {
    const newState: AuthState = {
      isAuthenticated: true,
      role,
      permissions: ROLE_PERMISSIONS[role],
    };
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const logout = useCallback(() => {
    const newState: AuthState = { isAuthenticated: false, role: 'viewer', permissions: [] };
    setState(newState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasPermission = useCallback(
    (permissionId: string) => state.permissions.includes(permissionId),
    [state.permissions],
  );

  const hasAnyPermission = useCallback(
    (permissionIds: string[]) => permissionIds.some(id => state.permissions.includes(id)),
    [state.permissions],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, logout, hasPermission, hasAnyPermission }),
    [state, login, logout, hasPermission, hasAnyPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { PERMISSIONS, ROLE_PERMISSIONS };
