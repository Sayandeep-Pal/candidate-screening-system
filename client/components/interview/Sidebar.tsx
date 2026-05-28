"use client";

import React from 'react';
import { User, Target, BarChart3, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  candidateName: string;
  role: string;
  currentQuestion: number;
  totalQuestions: number;
  history: { question: string; id: string }[];
}

export const Sidebar = ({ candidateName, role, currentQuestion, totalQuestions, history }: SidebarProps) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <aside className="w-80 border-r border-slate-800 bg-slate-950 flex flex-col hidden lg:flex">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <User className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-slate-200 uppercase tracking-tight truncate w-40">
              {candidateName}
            </h3>
            <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">
              Candidate
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-400 font-sans">{role}</span>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-400 font-sans">Active Session</span>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-slate-800">
        <div className="flex justify-between items-end mb-3">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Progress</span>
          <span className="font-mono text-xs text-cyan-500">{currentQuestion} / {totalQuestions}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
          <motion.div 
            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6">
        <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4">Question_History</h4>
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-[10px] text-slate-700 font-mono uppercase tracking-tight italic">
              No previous entries...
            </p>
          ) : (
            history.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group p-3 rounded-lg border border-slate-900 bg-slate-900/20 hover:border-slate-800 transition-colors cursor-help"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">Q{i + 1}</span>
                  <ChevronRight className="w-3 h-3 text-slate-800 group-hover:text-slate-500 transition-colors" />
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.question}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/10">
        <div className="flex items-center gap-2 text-[8px] font-mono text-slate-600">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          UPLINK_STABLE_LATENCY_24MS
        </div>
      </div>
    </aside>
  );
};
