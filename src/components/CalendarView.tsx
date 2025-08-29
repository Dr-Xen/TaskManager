'use client';

import { useState } from 'react';
import type { Task } from '@/lib/types';
import { Calendar } from "@/components/ui/calendar";
import { TaskCard } from './TaskCard';
import { isSameDay } from 'date-fns';

interface CalendarViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

export function CalendarView({ tasks, onEdit }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const tasksForSelectedDate = date 
    ? tasks.filter(task => isSameDay(task.dueDate, date)) 
    : [];

  const taskDates = tasks.map(task => task.dueDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 rounded-lg bg-card p-4 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
          modifiers={{ taskDays: taskDates }}
          modifiersClassNames={{
            taskDays: 'bg-primary/20 text-primary-foreground rounded-full',
          }}
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold font-headline text-primary">
          Tasks for {date ? date.toLocaleDateString() : 'selected date'}
        </h3>
        {tasksForSelectedDate.length > 0 ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {tasksForSelectedDate.map(task => (
                <div key={task.id} className="cursor-pointer" onClick={() => onEdit(task)}>
                    <p className={task.completed ? "line-through text-muted-foreground" : ""}>{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.category}</p>
                </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground pt-8 text-center">No tasks for this day.</p>
        )}
      </div>
    </div>
  );
}
