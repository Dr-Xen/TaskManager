import { Zap } from 'lucide-react';

export function ChronoLogo() {
  return (
    <div className="flex items-center gap-2 text-2xl font-bold font-headline text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]">
      <Zap className="w-6 h-6" />
      <span>ChronoFlow</span>
    </div>
  );
}
