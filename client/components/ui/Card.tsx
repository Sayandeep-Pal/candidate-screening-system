import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card = ({ children, className, glow = false }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm overflow-hidden transition-all duration-300',
        glow && 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('p-6 border-b border-slate-800', className)}>{children}</div>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('p-6', className)}>{children}</div>
);

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('p-6 border-t border-slate-800 bg-slate-900/20', className)}>{children}</div>
);
