"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center gap-4 mb-12">
      {[...Array(totalSteps)].map((_, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-3">
            <div 
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs border transition-all duration-500 ${
                i + 1 <= currentStep 
                  ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              0{i + 1}
            </div>
            <span className={`font-mono text-[10px] uppercase tracking-widest ${
              i + 1 <= currentStep ? 'text-cyan-400' : 'text-slate-600'
            }`}>
              {i === 0 ? 'Documentation' : 'Specialization'}
            </span>
          </div>
          {i < totalSteps - 1 && (
            <div className="flex-grow h-px bg-slate-800 relative">
              <motion.div 
                className="absolute inset-0 bg-cyan-500 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i + 1 < currentStep ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
