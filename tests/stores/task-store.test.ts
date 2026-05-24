import { beforeEach, describe, expect, it } from "vitest";

import {
  INITIAL_REMINDERS,
  INITIAL_TASKS,
  type Task,
  useTaskStore,
} from "../../src/app/components/pages/tasks/task-store";

describe("TaskStore — Types & Constants", () => {
  it("should export valid INITIAL_TASKS", () => {
    expect(INITIAL_TASKS).toBeInstanceOf(Array);
    expect(INITIAL_TASKS.length).toBeGreaterThan(0);
  });

  it("should have valid task structure", () => {
    for (const task of INITIAL_TASKS) {
      expect(task.id).toBeTruthy();
      expect(task.title).toBeTruthy();
      expect(["todo", "in-progress", "review", "done", "blocked"]).toContain(
        task.status,
      );
      expect(["critical", "high", "medium", "low"]).toContain(task.priority);
      expect([
        "feature",
        "bug",
        "refactor",
        "test",
        "documentation",
        "other",
      ]).toContain(task.type);
      expect(typeof task.createdAt).toBe("number");
      expect(typeof task.updatedAt).toBe("number");
      expect(typeof task.isArchived).toBe("boolean");
      expect(["manual", "ai-inferred", "imported"]).toContain(task.source);
    }
  });

  it("should export valid INITIAL_REMINDERS", () => {
    expect(INITIAL_REMINDERS).toBeInstanceOf(Array);
    expect(INITIAL_REMINDERS.length).toBeGreaterThan(0);
  });

  it("should have valid reminder structure", () => {
    for (const r of INITIAL_REMINDERS) {
      expect(r.id).toBeTruthy();
      expect(r.taskId).toBeTruthy();
      expect([
        "deadline",
        "dependency",
        "blocking",
        "progress",
        "custom",
      ]).toContain(r.type);
      expect(typeof r.message).toBe("string");
      expect(typeof r.remindAt).toBe("number");
      expect(typeof r.isTriggered).toBe("boolean");
      expect(typeof r.isRead).toBe("boolean");
    }
  });

  it("should have unique task IDs", () => {
    const ids = INITIAL_TASKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have unique reminder IDs", () => {
    const ids = INITIAL_REMINDERS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have tasks with valid subtask structure", () => {
    const withSubs = INITIAL_TASKS.filter(
      (t) => t.subtasks && t.subtasks.length > 0,
    );
    expect(withSubs.length).toBeGreaterThan(0);
    for (const task of withSubs) {
      for (const sub of task.subtasks!) {
        expect(sub.id).toBeTruthy();
        expect(sub.title).toBeTruthy();
        expect(typeof sub.isCompleted).toBe("boolean");
      }
    }
  });
});

describe("TaskStore — Store Actions", () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [], reminders: [], _hydrated: true });
  });

  it("should add a task and return id", () => {
    const id = useTaskStore.getState().addTask({
      title: "Test Task",
      description: "desc",
      status: "todo",
      priority: "high",
      type: "feature",
      source: "manual",
    });
    expect(id).toBeTruthy();
    expect(useTaskStore.getState().tasks.length).toBe(1);
    const added = useTaskStore.getState().tasks[0];
    expect(added.title).toBe("Test Task");
    expect(added.isArchived).toBe(false);
  });

  it("should update a task", () => {
    useTaskStore.getState().addTask({
      title: "Original",
      description: "",
      status: "todo",
      priority: "low",
      type: "bug",
      source: "manual",
    });
    const task = useTaskStore.getState().tasks[0];
    useTaskStore
      .getState()
      .updateTask(task.id, { title: "Updated", priority: "critical" });
    const updated = useTaskStore
      .getState()
      .tasks.find((t: Task) => t.id === task.id)!;
    expect(updated.title).toBe("Updated");
    expect(updated.priority).toBe("critical");
  });

  it("should delete a task", () => {
    const id = useTaskStore.getState().addTask({
      title: "ToDelete",
      description: "",
      status: "todo",
      priority: "low",
      type: "bug",
      source: "manual",
    });
    useTaskStore.getState().deleteTask(id);
    expect(
      useTaskStore.getState().tasks.find((t: Task) => t.id === id),
    ).toBeUndefined();
  });

  it("should archive a task", () => {
    const id = useTaskStore.getState().addTask({
      title: "Archive",
      description: "",
      status: "todo",
      priority: "low",
      type: "bug",
      source: "manual",
    });
    useTaskStore.getState().archiveTask(id);
    const task = useTaskStore.getState().tasks.find((t: Task) => t.id === id)!;
    expect(task.isArchived).toBe(true);
  });

  it("should duplicate a task", () => {
    useTaskStore.getState().addTask({
      title: "Original",
      description: "desc",
      status: "todo",
      priority: "medium",
      type: "feature",
      source: "manual",
    });
    const id = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().duplicateTask(id);
    expect(useTaskStore.getState().tasks.length).toBe(2);
    const dup = useTaskStore.getState().tasks[1];
    expect(dup.title).toContain("Original");
    expect(dup.id).not.toBe(id);
  });

  it("should move a task to new status", () => {
    const id = useTaskStore.getState().addTask({
      title: "Move",
      description: "",
      status: "todo",
      priority: "medium",
      type: "feature",
      source: "manual",
    });
    useTaskStore.getState().moveTask(id, "review");
    const moved = useTaskStore.getState().tasks.find((t: Task) => t.id === id)!;
    expect(moved.status).toBe("review");
  });

  it("should add and toggle a subtask", () => {
    const id = useTaskStore.getState().addTask({
      title: "Sub",
      description: "",
      status: "todo",
      priority: "medium",
      type: "feature",
      source: "manual",
    });
    useTaskStore.getState().addSubtask(id, "Sub task 1");
    const task = useTaskStore.getState().tasks.find((t: Task) => t.id === id)!;
    expect(task.subtasks?.length).toBe(1);
    const subId = task.subtasks?.[0].id;
    expect(task.subtasks?.[0].isCompleted).toBe(false);
    if (subId) {
      useTaskStore.getState().toggleSubtask(id, subId);
    }
    const toggled = useTaskStore
      .getState()
      .tasks.find((t: Task) => t.id === id)!;
    expect(toggled.subtasks?.[0].isCompleted).toBe(true);
  });

  it("should delete a subtask", () => {
    const id = useTaskStore.getState().addTask({
      title: "DelSub",
      description: "",
      status: "todo",
      priority: "medium",
      type: "feature",
      source: "manual",
    });
    useTaskStore.getState().addSubtask(id, "Sub 1");
    const subId = useTaskStore.getState().tasks.find((t: Task) => t.id === id)
      ?.subtasks?.[0].id;
    if (subId) {
      useTaskStore.getState().deleteSubtask(id, subId);
    }
    expect(
      useTaskStore.getState().tasks.find((t: Task) => t.id === id)?.subtasks
        ?.length,
    ).toBe(0);
  });

  it("should add a reminder", () => {
    const before = useTaskStore.getState().reminders.length;
    useTaskStore.getState().addReminder({
      taskId: "test-task",
      type: "deadline",
      message: "Test reminder",
      remindAt: Date.now() + 3600000,
    });
    expect(useTaskStore.getState().reminders.length).toBe(before + 1);
    const r =
      useTaskStore.getState().reminders[
        useTaskStore.getState().reminders.length - 1
      ];
    expect(r.isTriggered).toBe(false);
    expect(r.isRead).toBe(false);
  });

  it("should dismiss a reminder", () => {
    useTaskStore
      .getState()
      .addReminder({
        taskId: "t1",
        type: "deadline",
        message: "m",
        remindAt: Date.now(),
      });
    const rId = useTaskStore.getState().reminders[0].id;
    useTaskStore.getState().dismissReminder(rId);
    const dismissed = useTaskStore
      .getState()
      .reminders.find((r) => r.id === rId);
    expect(dismissed?.isRead).toBe(true);
  });

  it("should batch update status", () => {
    const id1 = useTaskStore.getState().addTask({
      title: "A",
      description: "",
      status: "todo",
      priority: "low",
      type: "bug",
      source: "manual",
    });
    const id2 = useTaskStore.getState().addTask({
      title: "B",
      description: "",
      status: "todo",
      priority: "low",
      type: "bug",
      source: "manual",
    });
    useTaskStore.getState().batchUpdateStatus([id1, id2], "done");
    expect(
      useTaskStore.getState().tasks.find((t: Task) => t.id === id1)?.status,
    ).toBe("done");
    expect(
      useTaskStore.getState().tasks.find((t: Task) => t.id === id2)?.status,
    ).toBe("done");
  });

  it("should batch delete", () => {
    const id1 = useTaskStore.getState().addTask({
      title: "A",
      description: "",
      status: "todo",
      priority: "low",
      type: "bug",
      source: "manual",
    });
    const id2 = useTaskStore.getState().addTask({
      title: "B",
      description: "",
      status: "todo",
      priority: "low",
      type: "bug",
      source: "manual",
    });
    useTaskStore.getState().batchDelete([id1, id2]);
    expect(useTaskStore.getState().tasks.length).toBe(0);
  });

  it("should seed initial data when empty", () => {
    expect(useTaskStore.getState().tasks.length).toBe(0);
    useTaskStore.getState().seedIfEmpty();
    expect(useTaskStore.getState().tasks.length).toBeGreaterThan(0);
    expect(useTaskStore.getState().reminders.length).toBeGreaterThan(0);
  });

  it("should NOT seed when tasks exist", () => {
    useTaskStore.getState().addTask({
      title: "Exists",
      description: "",
      status: "todo",
      priority: "low",
      type: "other",
      source: "manual",
    });
    const count = useTaskStore.getState().tasks.length;
    useTaskStore.getState().seedIfEmpty();
    expect(useTaskStore.getState().tasks.length).toBe(count);
  });
});
