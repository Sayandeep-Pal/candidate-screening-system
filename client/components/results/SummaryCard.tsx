"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Clock, Briefcase, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface SummaryCardProps {
  score: string;
  role: string;
  date: string;
  duration: string;
}

export const SummaryCard = ({ score, role, date, duration }: SummaryCardProps) => {
  return (
    <Card className="border-emerald-500/20 bg-slate-900/60 shadow-[0_0_30px_rgba(16,185,129,0.05)] mb-12">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="relative">
            <motion.div 
              className="w-32 h-32 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative z-10 bg-slate-950"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <Award className="w-12 h-12 text-emerald-500" />
            </motion.div>
            <motion.div 
              className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          <div className="flex-grow space-y-6 text-center md:text-left">
            <div>
              <h3 className="font-mono text-[10px] text-emerald-500 uppercase tracking-[0.3em] mb-2">Overall_Performance</h3>
              <h2 className="text-3xl font-bold text-slate-100">{score}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Role</span>
                </div>
                <p className="text-sm text-slate-300 font-sans">{role}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Date</span>
                </div>
                <p className="text-sm text-slate-300 font-sans">{date}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Duration</span>
                </div>
                <p className="text-sm text-slate-300 font-sans">{duration}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
