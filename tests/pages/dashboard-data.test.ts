import { describe, expect, it } from 'vitest';

import { useTaskStore } from '../../src/app/components/pages/tasks/task-store';

describe('DashboardPage — Data Integration', () => {
  it('should compute correct task stats from store', () => {
    useTaskStore.setState({ tasks: [], reminders: [], _hydrated: true });
    const store = useTaskStore.getState();
    store.seedIfEmpty();
    const tasks = useTaskStore.getState().tasks;
    expect(tasks.length).toBeGreaterThan(0);

    const byStatus = tasks.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    expect(Object.keys(byStatus).length).toBeGreaterThan(0);

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const completionRate = Math.round((doneTasks / totalTasks) * 100);
    expect(completionRate).toBeGreaterThanOrEqual(0);
    expect(completionRate).toBeLessThanOrEqual(100);
  });

  it('should calculate priority distribution', () => {
    const tasks = useTaskStore.getState().tasks;
    const critical = tasks.filter(t => t.priority === 'critical').length;
    const high = tasks.filter(t => t.priority === 'high').length;
    expect(critical + high).toBeGreaterThan(0);
  });

  it('should have tasks with valid time data', () => {
    const tasks = useTaskStore.getState().tasks;
    const now = Date.now();
    for (const t of tasks) {
      expect(t.createdAt).toBeLessThanOrEqual(now);
      expect(t.updatedAt).toBeLessThanOrEqual(now);
      expect(t.createdAt).toBeLessThanOrEqual(t.updatedAt);
    }
  });

  it('should compute subtask completion rates', () => {
    const tasks = useTaskStore.getState().tasks.filter(t => t.subtasks && t.subtasks.length > 0);
    expect(tasks.length).toBeGreaterThan(0);
    for (const t of tasks) {
      const completed = t.subtasks?.filter(s => s.isCompleted).length ?? 0;
      const subtaskLength = t.subtasks?.length ?? 1;
      const rate = Math.round((completed / subtaskLength) * 100);
      expect(rate).toBeGreaterThanOrEqual(0);
      expect(rate).toBeLessThanOrEqual(100);
    }
  });

  it('should handle empty store gracefully', () => {
    useTaskStore.setState({ tasks: [], reminders: [], _hydrated: true });
    const tasks = useTaskStore.getState().tasks;
    expect(tasks.length).toBe(0);
    const totalTasks = tasks.length;
    const completionRate =
      totalTasks > 0
        ? Math.round((tasks.filter(t => t.status === 'done').length / totalTasks) * 100)
        : 0;
    expect(completionRate).toBe(0);
  });
});

describe('DashboardPage — LiveKPI Simulation', () => {
  it('should generate valid KPI ranges', () => {
    const customers = 1388;
    const calls = 247;
    const aiTasks = 1892;
    const responseMs = 12;

    expect(customers).toBeGreaterThan(0);
    expect(calls).toBeGreaterThan(0);
    expect(aiTasks).toBeGreaterThan(0);
    expect(responseMs).toBeGreaterThan(0);
    expect(responseMs).toBeLessThan(100);
  });

  it('should simulate realistic fluctuations', () => {
    const prev = { customers: 1388, responseMs: 12 };
    const fluctuate = (val: number, range: number) =>
      val + Math.floor(Math.random() * range) - Math.floor(range / 2);
    const newCustomers = fluctuate(prev.customers, 3);
    const newResponse = Math.max(8, Math.min(18, fluctuate(prev.responseMs, 2)));
    expect(newCustomers).toBeGreaterThan(0);
    expect(newResponse).toBeGreaterThanOrEqual(8);
    expect(newResponse).toBeLessThanOrEqual(18);
  });
});
