import { Task, TaskStatus } from "@prisma/client";

export function calculatePercentageCompletion(tasks: Task[]): number {
  const allTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETE
  ).length;
  return allTasks === 0 ? 0 : Math.round((completedTasks / allTasks) * 100);
}
