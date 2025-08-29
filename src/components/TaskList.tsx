'use client';

import { useState, useMemo } from 'react';
import type { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ListX, Filter } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

type SortOption = 'priority' | 'dueDate-asc' | 'dueDate-desc' | 'title-asc';

export function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskListProps) {
  const [sortOption, setSortOption] = useState<SortOption>('priority');
  const [filterCategory, setFilterCategory] = useState('');

  const sortedAndFilteredTasks = useMemo(() => {
    let filtered = tasks;

    if (filterCategory) {
      filtered = tasks.filter((task) =>
        task.category.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }
    
    return [...filtered].sort((a, b) => {
      if(a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      switch (sortOption) {
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'dueDate-asc':
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'dueDate-desc':
          return b.dueDate.getTime() - a.dueDate.getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [tasks, sortOption, filterCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by category..."
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="dueDate-asc">Due Date (Oldest First)</SelectItem>
            <SelectItem value="dueDate-desc">Due Date (Newest First)</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedAndFilteredTasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedAndFilteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-4">
            <ListX className="w-16 h-16" />
            <h2 className="text-2xl font-bold">No tasks found</h2>
            <p>Try clearing your filters or adding a new task.</p>
        </div>
      )}
    </div>
  );
}
