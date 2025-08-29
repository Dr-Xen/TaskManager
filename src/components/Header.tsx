'use client';

import type { Task } from '@/lib/types';
import { ChronoLogo } from '@/components/ChronoLogo';
import { SmartSuggestions } from '@/components/SmartSuggestions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onAddTask: () => void;
  tasks: Task[];
}

export function Header({ onAddTask, tasks }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <ChronoLogo />
        <div className="flex items-center gap-2">
          <SmartSuggestions tasks={tasks} />
          <Button onClick={onAddTask} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
    </header>
  );
}
