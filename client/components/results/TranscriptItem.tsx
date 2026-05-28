"use client";

import React from 'react';
import { MessageSquare, User, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface TranscriptItemProps {
  question: string;
  answer: string;
  evaluation?: string;
  index: number;
}

export const TranscriptItem = ({ question, answer, evaluation, index }: TranscriptItemProps) => {
  return (
    <div className="relative pl-12 pb-12 last:pb-0">
      {/* Timeline Line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-800 last:hidden" />
      
      {/* Timeline Dot */}
      <div className="absolute left-0 top-0 w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center z-10">
        <span className="font-mono text-xs text-slate-500">{index + 1}</span>
      </div>

      <div className="space-y-6">
        {/* Question */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Interviewer_Query</span>
          </div>
          <p className="text-lg font-bold text-slate-200 leading-relaxed">
            {question}
          </p>
        </div>

        {/* Answer */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Candidate_Response</span>
            </div>
            {evaluation && (
              <Badge variant="success">
                AI_EVAL: {evaluation}
              </Badge>
            )}
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-sans">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};
