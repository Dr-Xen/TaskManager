'use client';

import type { Task } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Pencil } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onToggleComplete, onDelete, onEdit }: TaskCardProps) {
  const priorityColors = {
    high: 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30',
    medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-400 hover:bg-yellow-500/30',
    low: 'bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30',
  };

  return (
    <Card
      className={cn(
        'flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/50',
        task.completed ? 'bg-card/50 text-muted-foreground' : 'bg-card',
        'hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]'
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className={cn('font-headline text-lg', task.completed && 'line-through text-muted-foreground')}>
            {task.title}
          </CardTitle>
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
            className="mt-1 shrink-0"
          />
        </div>
        <CardDescription className={cn(task.completed && 'line-through')}>{task.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="text-sm">
          <span className="font-semibold">Due: </span>
          {format(task.dueDate, 'PPP')}
        </div>
        <Badge variant="outline" className={cn('capitalize', priorityColors[task.priority])}>
          {task.priority} Priority
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label={`Edit task ${task.title}`}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="hover:bg-destructive/20 hover:text-destructive" aria-label={`Delete task ${task.title}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
