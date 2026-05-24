import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==========================================
// Types
// ==========================================

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskType = 'feature' | 'bug' | 'refactor' | 'test' | 'documentation' | 'other';
export type ReminderType = 'deadline' | 'dependency' | 'blocking' | 'progress' | 'custom';
export type ViewMode = 'kanban' | 'list' | 'stats';

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  estimatedHours?: number;
  actualHours?: number;
  relatedMessageId?: string;
  relatedFiles?: string[];
  tags?: string[];
  subtasks?: SubTask[];
  dependencies?: string[];
  blocking?: string[];
  assigneeId?: string;
  isArchived: boolean;
  source: 'manual' | 'ai-inferred' | 'imported';
  confidence?: number;
}

export interface Reminder {
  id: string;
  taskId: string;
  type: ReminderType;
  message: string;
  remindAt: number;
  isTriggered: boolean;
  isRead: boolean;
  createdAt: number;
}

export interface TaskInferenceResult {
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  confidence: number;
  reasoning: string;
  tags: string[];
  estimatedHours?: number;
  relatedFiles?: string[];
}

// ==========================================
// Initial Mock Data
// ==========================================

export const INITIAL_TASKS: Task[] = (() => {
  const now = Date.now();
  return [
    {
      id: 't1',
      title: '实现用户认证模块',
      description: '集成 OAuth2.0 + JWT，支持多种登录方式（邮箱、手机号、微信扫码）',
      status: 'in-progress' as TaskStatus,
      priority: 'critical' as TaskPriority,
      type: 'feature' as TaskType,
      createdAt: now - 86400000 * 3,
      updatedAt: now - 3600000,
      dueDate: now + 86400000 * 2,
      estimatedHours: 16,
      actualHours: 8,
      relatedFiles: ['src/auth/provider.ts', 'src/middleware/jwt.ts'],
      tags: ['auth', 'security', 'P0'],
      subtasks: [
        {
          id: 'st1',
          title: 'JWT Token 签发/验证',
          isCompleted: true,
          createdAt: now - 86400000 * 3,
        },
        {
          id: 'st2',
          title: 'OAuth2.0 Provider 集成',
          isCompleted: true,
          createdAt: now - 86400000 * 3,
        },
        { id: 'st3', title: '微信扫码登录适配', isCompleted: false, createdAt: now - 86400000 * 2 },
        { id: 'st4', title: 'Token 刷新机制', isCompleted: false, createdAt: now - 86400000 * 2 },
      ],
      dependencies: [],
      blocking: ['t5'],
      isArchived: false,
      source: 'manual' as const,
    },
    {
      id: 't2',
      title: '修复数据看板图表渲染异常',
      description: 'Recharts 在窗口 resize 时偶现空白，需添加 ResponsiveContainer 和防抖处理',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      type: 'bug' as TaskType,
      createdAt: now - 86400000 * 2,
      updatedAt: now - 86400000,
      dueDate: now + 86400000,
      estimatedHours: 4,
      relatedFiles: ['src/components/dashboard-page.tsx'],
      tags: ['bug', 'UI', 'charts'],
      isArchived: false,
      source: 'ai-inferred' as const,
      confidence: 0.92,
    },
    {
      id: 't3',
      title: '优化 AI 模型调用缓存策略',
      description: '引入 LRU 缓存减少重复 API 调用，预估节省 40% token 消耗',
      status: 'review' as TaskStatus,
      priority: 'medium' as TaskPriority,
      type: 'refactor' as TaskType,
      createdAt: now - 86400000 * 5,
      updatedAt: now - 7200000,
      estimatedHours: 8,
      actualHours: 6,
      relatedFiles: ['src/ai/cache.ts', 'src/ai/provider.ts'],
      tags: ['performance', 'AI', 'cache'],
      subtasks: [
        { id: 'st5', title: '设计 LRU 缓存模块', isCompleted: true, createdAt: now - 86400000 * 5 },
        {
          id: 'st6',
          title: '集成到 Provider Manager',
          isCompleted: true,
          createdAt: now - 86400000 * 4,
        },
        { id: 'st7', title: '编写性能测试', isCompleted: false, createdAt: now - 86400000 * 3 },
      ],
      isArchived: false,
      source: 'manual' as const,
    },
    {
      id: 't4',
      title: '编写 API 接口测试用例',
      description: '为核心 RESTful 接口编写 Jest 单元测试，覆盖率目标 ≥85%',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      type: 'test' as TaskType,
      createdAt: now - 86400000,
      updatedAt: now - 86400000,
      estimatedHours: 12,
      relatedFiles: ['src/api/**/*.test.ts'],
      tags: ['test', 'quality', 'API'],
      isArchived: false,
      source: 'manual' as const,
    },
    {
      id: 't5',
      title: '完善 i18n 多语言支持',
      description: '补全日语、韩语语言包；修复动态插值变量在 RTL 布局下的显示问题',
      status: 'blocked' as TaskStatus,
      priority: 'low' as TaskPriority,
      type: 'feature' as TaskType,
      createdAt: now - 86400000 * 4,
      updatedAt: now - 86400000 * 2,
      estimatedHours: 6,
      relatedFiles: ['src/locales/ja.ts', 'src/locales/ko.ts'],
      tags: ['i18n', 'localization'],
      dependencies: ['t1'],
      isArchived: false,
      source: 'ai-inferred' as const,
      confidence: 0.85,
    },
    {
      id: 't6',
      title: '升级 Tailwind CSS v4 配置',
      description: '迁移至 v4 新语法，移除已废弃的 @apply 用法，启用原生 CSS 变量主题',
      status: 'done' as TaskStatus,
      priority: 'medium' as TaskPriority,
      type: 'refactor' as TaskType,
      createdAt: now - 86400000 * 7,
      updatedAt: now - 86400000,
      estimatedHours: 4,
      actualHours: 3,
      relatedFiles: ['src/styles/theme.css'],
      tags: ['infra', 'CSS', 'migration'],
      isArchived: false,
      source: 'manual' as const,
    },
    {
      id: 't7',
      title: '实现智能表单拖拽排序',
      description: '使用 react-dnd 实现表单字段拖拽重排，支持嵌套分组',
      status: 'todo' as TaskStatus,
      priority: 'high' as TaskPriority,
      type: 'feature' as TaskType,
      createdAt: now - 86400000,
      updatedAt: now - 3600000 * 4,
      dueDate: now + 86400000 * 3,
      estimatedHours: 10,
      relatedFiles: ['src/components/smart-form-system.tsx'],
      tags: ['DnD', 'forms', 'UX'],
      isArchived: false,
      source: 'manual' as const,
    },
    {
      id: 't8',
      title: '编写组件库 Storybook 文档',
      description: '为所有液态玻璃/赛博朋克组件编写交互式 Storybook stories',
      status: 'todo' as TaskStatus,
      priority: 'low' as TaskPriority,
      type: 'documentation' as TaskType,
      createdAt: now - 86400000 * 2,
      updatedAt: now - 86400000 * 2,
      estimatedHours: 8,
      tags: ['docs', 'storybook', 'components'],
      isArchived: false,
      source: 'ai-inferred' as const,
      confidence: 0.78,
    },
    {
      id: 't9',
      title: '修复移动端侧边栏遮挡问题',
      description: 'sidebar overlay 在 iOS Safari 下未正确触发 pointer-events',
      status: 'in-progress' as TaskStatus,
      priority: 'high' as TaskPriority,
      type: 'bug' as TaskType,
      createdAt: now - 86400000,
      updatedAt: now - 1800000,
      dueDate: now + 86400000,
      estimatedHours: 3,
      actualHours: 1.5,
      relatedFiles: ['src/components/cyberpunk-standalone.tsx'],
      tags: ['mobile', 'bug', 'iOS'],
      isArchived: false,
      source: 'manual' as const,
    },
    {
      id: 't10',
      title: '集成 Sentry 错误监控',
      description: '接入 Sentry SDK，配置 sourcemap 上传和告警规则',
      status: 'done' as TaskStatus,
      priority: 'medium' as TaskPriority,
      type: 'feature' as TaskType,
      createdAt: now - 86400000 * 10,
      updatedAt: now - 86400000 * 3,
      estimatedHours: 5,
      actualHours: 4,
      tags: ['monitoring', 'infra', 'Sentry'],
      isArchived: false,
      source: 'manual' as const,
    },
  ];
})();

export const INITIAL_REMINDERS: Reminder[] = (() => {
  const now = Date.now();
  return [
    {
      id: 'r1',
      taskId: 't1',
      type: 'deadline' as ReminderType,
      message: '用户认证模块将在 2 天后到期',
      remindAt: now + 3600000,
      isTriggered: false,
      isRead: false,
      createdAt: now - 3600000,
    },
    {
      id: 'r2',
      taskId: 't2',
      type: 'deadline' as ReminderType,
      message: '图表渲染修复明天截止',
      remindAt: now + 3600000 * 2,
      isTriggered: false,
      isRead: false,
      createdAt: now - 7200000,
    },
    {
      id: 'r3',
      taskId: 't5',
      type: 'blocking' as ReminderType,
      message: 'i18n 任务被认证模块阻塞',
      remindAt: now,
      isTriggered: true,
      isRead: false,
      createdAt: now - 86400000,
    },
    {
      id: 'r4',
      taskId: 't3',
      type: 'progress' as ReminderType,
      message: 'AI 缓存优化进度已达 75%',
      remindAt: now,
      isTriggered: true,
      isRead: true,
      createdAt: now - 14400000,
    },
  ];
})();

// ==========================================
// Zustand Task Store
// ==========================================

export interface TaskStoreState {
  tasks: Task[];
  reminders: Reminder[];
  _hydrated: boolean;
}

export interface TaskStoreActions {
  addTask: (
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'> & { source?: Task['source'] },
  ) => string;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  archiveTask: (taskId: string) => void;
  duplicateTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  reorderInColumn: (taskId: string, targetId: string, position: 'before' | 'after') => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  batchUpdateStatus: (taskIds: string[], status: TaskStatus) => void;
  batchDelete: (taskIds: string[]) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'isTriggered' | 'isRead'>) => void;
  dismissReminder: (reminderId: string) => void;
  seedIfEmpty: () => void;
}

export const useTaskStore = create<TaskStoreState & TaskStoreActions>()(
  persist(
    (set, get) => ({
      tasks: [],
      reminders: [],
      _hydrated: false,

      addTask: taskData => {
        const id = crypto.randomUUID();
        const newTask: Task = {
          ...taskData,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isArchived: false,
          source: taskData.source ?? 'manual',
        };
        set(s => ({ tasks: [...s.tasks, newTask] }));
        return id;
      },

      updateTask: (taskId, updates) => {
        set(s => ({
          tasks: s.tasks.map(t =>
            t.id === taskId ? { ...t, ...updates, updatedAt: Date.now() } : t,
          ),
        }));
      },

      deleteTask: taskId => {
        set(s => ({
          tasks: s.tasks.filter(t => t.id !== taskId),
          reminders: s.reminders.filter(r => r.taskId !== taskId),
        }));
      },

      archiveTask: taskId => {
        set(s => ({
          tasks: s.tasks.map(t =>
            t.id === taskId ? { ...t, isArchived: true, updatedAt: Date.now() } : t,
          ),
        }));
      },

      duplicateTask: taskId => {
        const src = get().tasks.find(t => t.id === taskId);
        if (!src) return;
        const dup: Task = {
          ...src,
          id: crypto.randomUUID(),
          title: `${src.title} (Copy)`,
          status: 'todo',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isArchived: false,
          source: 'manual',
          subtasks: src.subtasks?.map(st => ({
            ...st,
            id: crypto.randomUUID(),
            isCompleted: false,
          })),
        };
        set(s => ({ tasks: [...s.tasks, dup] }));
      },

      moveTask: (taskId, newStatus) => {
        const task = get().tasks.find(t => t.id === taskId);
        set(s => ({
          tasks: s.tasks.map(t =>
            t.id === taskId ? { ...t, status: newStatus, updatedAt: Date.now() } : t,
          ),
        }));
        if (task) {
          window.dispatchEvent(
            new CustomEvent('yyc3-task-moved', {
              detail: { taskId, taskTitle: task.title, from: task.status, to: newStatus },
            }),
          );
        }
      },

      reorderInColumn: (taskId, targetId, position) => {
        set(s => {
          const tasks = [...s.tasks];
          const srcIdx = tasks.findIndex(t => t.id === taskId);
          const tgtIdx = tasks.findIndex(t => t.id === targetId);
          if (srcIdx === -1 || tgtIdx === -1 || srcIdx === tgtIdx) return s;
          const [moved] = tasks.splice(srcIdx, 1);
          const insertIdx = tasks.findIndex(t => t.id === targetId);
          tasks.splice(position === 'before' ? insertIdx : insertIdx + 1, 0, moved);
          return { tasks };
        });
      },

      addSubtask: (taskId, title) => {
        const st: SubTask = {
          id: crypto.randomUUID(),
          title,
          isCompleted: false,
          createdAt: Date.now(),
        };
        set(s => ({
          tasks: s.tasks.map(t =>
            t.id === taskId
              ? { ...t, subtasks: [...(t.subtasks ?? []), st], updatedAt: Date.now() }
              : t,
          ),
        }));
      },

      toggleSubtask: (taskId, subtaskId) => {
        set(s => ({
          tasks: s.tasks.map(t => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              subtasks: t.subtasks?.map(st =>
                st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st,
              ),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      deleteSubtask: (taskId, subtaskId) => {
        set(s => ({
          tasks: s.tasks.map(t => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              subtasks: t.subtasks?.filter(st => st.id !== subtaskId),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      batchUpdateStatus: (taskIds, status) => {
        set(s => ({
          tasks: s.tasks.map(t =>
            taskIds.includes(t.id) ? { ...t, status, updatedAt: Date.now() } : t,
          ),
        }));
      },

      batchDelete: taskIds => {
        set(s => ({
          tasks: s.tasks.filter(t => !taskIds.includes(t.id)),
          reminders: s.reminders.filter(r => !taskIds.includes(r.taskId)),
        }));
      },

      addReminder: data => {
        const r: Reminder = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          isTriggered: false,
          isRead: false,
        };
        set(s => ({ reminders: [...s.reminders, r] }));
      },

      dismissReminder: reminderId => {
        set(s => ({
          reminders: s.reminders.map(r => (r.id === reminderId ? { ...r, isRead: true } : r)),
        }));
      },

      seedIfEmpty: () => {
        const { tasks, reminders: _reminders } = get();
        if (tasks.length === 0) {
          set({ tasks: INITIAL_TASKS, reminders: INITIAL_REMINDERS, _hydrated: true });
        } else {
          set({ _hydrated: true });
        }
      },
    }),
    {
      name: 'yyc3-task-board-storage',
      partialize: state => ({
        tasks: state.tasks,
        reminders: state.reminders,
      }),
      onRehydrateStorage: () => state => {
        state?.seedIfEmpty();
      },
    },
  ),
);
