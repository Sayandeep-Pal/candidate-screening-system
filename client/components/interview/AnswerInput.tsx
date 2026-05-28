"use client";

import React, { useState, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  isLoading: boolean;
}

export const AnswerInput = ({ onSubmit, isLoading }: AnswerInputProps) => {
  const [answer, setAnswer] = useState('');
  const maxChars = 2000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !isLoading) {
      onSubmit(answer);
      setAnswer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Terminal input: Type your technical response here..."
          className="w-full min-h-[300px] bg-slate-900/30 border border-slate-800 rounded-xl p-6 text-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none placeholder:text-slate-700"
          disabled={isLoading}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-4">
          <div className="px-3 py-1 rounded bg-slate-950/50 border border-slate-800/50 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            Chars: <span className={answer.length > maxChars * 0.9 ? 'text-rose-500' : 'text-slate-400'}>
              {answer.length}
            </span> / {maxChars}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          size="lg" 
          disabled={!answer.trim() || isLoading}
          isLoading={isLoading}
          className="px-10 group"
        >
          Submit Answer
          <SendHorizontal className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </form>
  );
};
