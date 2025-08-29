'use client';

import { useState } from 'react';
import { suggestTaskPriorities, SuggestTaskPrioritiesOutput } from '@/ai/flows/suggest-task-priorities';
import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Sparkles, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

interface SmartSuggestionsProps {
  tasks: Task[];
}

export function SmartSuggestions({ tasks }: SmartSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestTaskPrioritiesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggest = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setSuggestions(null);

    const activeTasks = tasks
        .filter(t => !t.completed)
        .map(task => ({
            ...task,
            dueDate: task.dueDate.toISOString(),
        }));
    
    if (activeTasks.length === 0) {
        setIsLoading(false);
        setSuggestions({ prioritizedTasks: [{title: "No active tasks!", reason: "Add some tasks to get suggestions."}] });
        return;
    }

    try {
      const result = await suggestTaskPriorities({ tasks: activeTasks });
      setSuggestions(result);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        title: 'AI Error',
        description: 'Could not get suggestions from the AI.',
        variant: 'destructive',
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleSuggest} variant="outline" className="border-accent text-accent hover:bg-accent/10">
        <Sparkles className="w-4 h-4 mr-2" />
        Suggest
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-card border-accent/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-accent">
              <Bot />
              AI Task Prioritization
            </DialogTitle>
            <DialogDescription>
              Here's what our AI suggests you focus on next based on your active tasks.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 space-y-4 max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            )}
            {suggestions?.prioritizedTasks.map((task, index) => (
              <div key={index} className="p-3 rounded-lg bg-background">
                <h4 className="font-bold text-primary">{index + 1}. {task.title}</h4>
                <p className="text-sm text-muted-foreground">{task.reason}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
