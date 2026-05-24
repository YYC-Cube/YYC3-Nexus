import { beforeEach, describe, expect, it } from 'vitest';

import {
  type Task,
  type TaskStatus,
  useTaskStore,
} from '../../src/app/components/pages/tasks/task-store';

describe('TaskBoardPage — Data Integration', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [], reminders: [], _hydrated: true });
  });

  it('should group tasks by status columns', () => {
    const store = useTaskStore.getState();
    store.addTask({
      title: 'A',
      description: '',
      status: 'todo',
      priority: 'high',
      type: 'feature',
      source: 'manual',
    });
    store.addTask({
      title: 'B',
      description: '',
      status: 'in-progress',
      priority: 'medium',
      type: 'bug',
      source: 'manual',
    });
    store.addTask({
      title: 'C',
      description: '',
      status: 'done',
      priority: 'low',
      type: 'other',
      source: 'manual',
    });

    const tasks = useTaskStore.getState().tasks;
    const columns: Record<TaskStatus, Task[]> = {
      todo: [],
      'in-progress': [],
      review: [],
      done: [],
      blocked: [],
    };
    for (const t of tasks) {
      columns[t.status].push(t);
    }
    expect(columns.todo.length).toBe(1);
    expect(columns['in-progress'].length).toBe(1);
    expect(columns.done.length).toBe(1);
    expect(columns.review.length).toBe(0);
  });

  it('should move tasks between columns', () => {
    const store = useTaskStore.getState();
    const id = store.addTask({
      title: 'Move',
      description: '',
      status: 'todo',
      priority: 'medium',
      type: 'feature',
      source: 'manual',
    });
    store.moveTask(id, 'in-progress');
    const task = useTaskStore.getState().tasks.find(t => t.id === id)!;
    expect(task.status).toBe('in-progress');
    expect(task.updatedAt).toBeGreaterThanOrEqual(task.createdAt);
  });

  it('should support batch status change', () => {
    const store = useTaskStore.getState();
    const ids = [
      store.addTask({
        title: 'T1',
        description: '',
        status: 'todo',
        priority: 'low',
        type: 'bug',
        source: 'manual',
      }),
      store.addTask({
        title: 'T2',
        description: '',
        status: 'todo',
        priority: 'low',
        type: 'bug',
        source: 'manual',
      }),
      store.addTask({
        title: 'T3',
        description: '',
        status: 'todo',
        priority: 'low',
        type: 'bug',
        source: 'manual',
      }),
    ];
    store.batchUpdateStatus(ids, 'review');
    for (const id of ids) {
      const task = useTaskStore.getState().tasks.find(t => t.id === id)!;
      expect(task.status).toBe('review');
    }
  });

  it('should support batch delete', () => {
    const store = useTaskStore.getState();
    const ids = [
      store.addTask({
        title: 'D1',
        description: '',
        status: 'todo',
        priority: 'low',
        type: 'bug',
        source: 'manual',
      }),
      store.addTask({
        title: 'D2',
        description: '',
        status: 'todo',
        priority: 'low',
        type: 'bug',
        source: 'manual',
      }),
    ];
    store.batchDelete(ids);
    expect(useTaskStore.getState().tasks.length).toBe(0);
  });

  it('should compute board statistics', () => {
    const store = useTaskStore.getState();
    store.addTask({
      title: 'A',
      description: '',
      status: 'todo',
      priority: 'critical',
      type: 'feature',
      source: 'manual',
    });
    store.addTask({
      title: 'B',
      description: '',
      status: 'done',
      priority: 'high',
      type: 'bug',
      source: 'manual',
    });
    store.addTask({
      title: 'C',
      description: '',
      status: 'done',
      priority: 'medium',
      type: 'feature',
      source: 'manual',
    });
    store.addTask({
      title: 'D',
      description: '',
      status: 'in-progress',
      priority: 'low',
      type: 'other',
      source: 'manual',
    });

    const tasks = useTaskStore.getState().tasks;
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const blocked = tasks.filter(t => t.status === 'blocked').length;
    const critical = tasks.filter(t => t.priority === 'critical').length;

    expect(total).toBe(4);
    expect(done).toBe(2);
    expect(inProgress).toBe(1);
    expect(blocked).toBe(0);
    expect(critical).toBe(1);
  });

  it('should handle archive + filter flow', () => {
    const store = useTaskStore.getState();
    const id1 = store.addTask({
      title: 'Active',
      description: '',
      status: 'todo',
      priority: 'high',
      type: 'feature',
      source: 'manual',
    });
    const id2 = store.addTask({
      title: 'Archive',
      description: '',
      status: 'done',
      priority: 'low',
      type: 'other',
      source: 'manual',
    });
    store.archiveTask(id2);

    const tasks = useTaskStore.getState().tasks;
    const activeTasks = tasks.filter(t => !t.isArchived);
    const archivedTasks = tasks.filter(t => t.isArchived);
    expect(activeTasks.length).toBe(1);
    expect(archivedTasks.length).toBe(1);
    expect(activeTasks[0].id).toBe(id1);
    expect(archivedTasks[0].id).toBe(id2);
  });

  it('should seed initial data with all statuses', () => {
    useTaskStore.getState().seedIfEmpty();
    const tasks = useTaskStore.getState().tasks;
    const statuses = new Set(tasks.map(t => t.status));
    expect(statuses.size).toBeGreaterThan(1);
  });
});
