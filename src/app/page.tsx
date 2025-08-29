'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Task } from '@/lib/types';
import { Header } from '@/components/Header';
import { TaskList } from '@/components/TaskList';
import { CalendarView } from '@/components/CalendarView';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const initialTasks: Task[] = [
  { id: '1', title: 'Design futuristic UI mockups', dueDate: new Date('2024-08-15'), priority: 'high', category: 'Design', completed: false },
  { id: '2', title: 'Develop core components', dueDate: new Date('2024-08-20'), priority: 'high', category: 'Development', completed: false },
  { id: '3', title: 'Setup AI suggestion engine', dueDate: new Date('2024-08-25'), priority: 'medium', category: 'AI', completed: true },
  { id: '4', title: 'User testing session', dueDate: new Date('2024-09-01'), priority: 'low', category: 'QA', completed: false },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedTasks = localStorage.getItem('chronoFlowTasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks, (key, value) => {
        if (key === 'dueDate') {
          return new Date(value);
        }
        return value;
      });
      setTasks(parsedTasks);
    } else {
      setTasks(initialTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chronoFlowTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const overdueTasks = tasks.filter(
      (task) => !task.completed && task.dueDate < now
    );
    if (overdueTasks.length > 0) {
      toast({
        title: 'Overdue Tasks',
        description: `You have ${overdueTasks.length} overdue task(s). Better get to it!`,
        variant: 'destructive',
      });
    }
  }, [tasks, toast]);


  const handleAddTask = useCallback((taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = { ...taskData, id: uuidv4(), completed: false };
    setTasks((prev) => [newTask, ...prev]);
    setIsFormOpen(false);
    toast({ title: 'Task Created!', description: `"${taskData.title}" has been added.` });
  }, [toast]);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
    setIsFormOpen(false);
    toast({ title: 'Task Updated!', description: `"${updatedTask.title}" has been saved.` });
  }, [toast]);

  const handleSaveTask = useCallback(
    (taskData: Omit<Task, 'id' | 'completed'>) => {
      if (editingTask) {
        handleUpdateTask({ ...taskData, id: editingTask.id, completed: editingTask.completed });
      } else {
        handleAddTask(taskData);
      }
    },
    [editingTask, handleAddTask, handleUpdateTask]
  );

  const handleDeleteTask = useCallback((taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (taskToDelete) {
      toast({ title: 'Task Deleted', description: `"${taskToDelete.title}" has been removed.`, variant: 'destructive' });
    }
  }, [tasks, toast]);

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);
  
  const handleOpenForm = (task: Task | null) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header onAddTask={() => handleOpenForm(null)} tasks={tasks} />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'calendar')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-6 bg-card">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="motion-safe:animate-in motion-safe:fade-in">
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onEdit={(task) => handleOpenForm(task)}
            />
          </TabsContent>
          <TabsContent value="calendar" className="motion-safe:animate-in motion-safe:fade-in">
            <CalendarView tasks={tasks} onEdit={(task) => handleOpenForm(task)} />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle className="font-headline text-primary">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
            <DialogDescription>
              {editingTask ? 'Update the details of your task.' : 'Add a new task to your list.'}
            </DialogDescription>
          </DialogHeader>
          <TaskForm 
            onSave={handleSaveTask} 
            onCancel={() => setIsFormOpen(false)} 
            task={editingTask} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
