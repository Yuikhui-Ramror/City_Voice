'use client';

import { cn } from '@/lib/utils';
import type { IssueStatus } from '@/lib/data';
import { CheckCircle2 } from 'lucide-react';

const statuses: IssueStatus[] = [
  'Submitted',
  'Acknowledged',
  'In Progress',
  'Resolved',
];

type StatusStepperProps = {
  currentStatus: IssueStatus;
  className?: string;
};

export function StatusStepper({ currentStatus, className }: StatusStepperProps) {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className={cn('flex w-full items-center', className)}>
      {statuses.map((status, index) => {
        const isActive = index <= currentIndex;
        const isCompleted = index < currentIndex;
        const isLast = index === statuses.length - 1;

        return (
          <div key={status} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
                  isActive ? 'border-primary bg-primary' : 'border-border bg-muted',
                )}
              >
                {isCompleted ? (
                   <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <div
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      isActive ? 'bg-primary-foreground' : 'bg-border',
                    )}
                  />
                )}
              </div>
              <p
                className={cn(
                  'mt-2 text-center text-xs font-medium',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {status}
              </p>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'h-0.5 flex-1',
                  isCompleted ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
