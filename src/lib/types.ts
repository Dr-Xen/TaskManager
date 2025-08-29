export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: TaskPriority;
  category: string;
  completed: boolean;
}
