"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Info, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface QuestionCardProps {
  question: string;
  domain: string;
  questionNumber: number;
}

export const QuestionCard = ({ question, domain, questionNumber }: QuestionCardProps) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <Card className="relative overflow-visible border-cyan-500/20 bg-slate-900/60 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
      <div className="absolute -top-3 -left-3 px-3 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-cyan-500 shadow-xl z-10 uppercase tracking-[0.2em]">
        Question_{questionNumber}
      </div>

      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-cyan-500" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{domain}</span>
        </div>
        <button 
          onClick={() => setShowHint(!showHint)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
            showHint ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-600 hover:text-slate-400'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono uppercase tracking-tighter">Context_Hint</span>
        </button>
      </CardHeader>

      <CardContent className="py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={question}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-slate-100 leading-tight">
              {question}
            </h2>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-lg bg-slate-950 border border-slate-800/50 flex gap-3"
              >
                <HelpCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed font-sans italic">
                  Domain insights: This question targets your understanding of {domain.toLowerCase()} principles 
                  and how you apply them in complex, real-world engineering scenarios.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
