"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Server, Brain, Database, Layout, Layers } from 'lucide-react';

const ROLES = [
  { 
    id: 'backend', 
    name: 'Backend Engineer', 
    description: 'Focus on distributed systems, API architecture, and high-performance databases.', 
    icon: Server 
  },
  { 
    id: 'aiml', 
    name: 'AI/ML Engineer', 
    description: 'Neural networks, computer vision, and large-scale data processing pipelines.', 
    icon: Brain 
  },
  { 
    id: 'data', 
    name: 'Data Scientist', 
    description: 'Statistical modeling, predictive analytics, and insightful data visualization.', 
    icon: Database 
  },
  { 
    id: 'frontend', 
    name: 'Frontend Engineer', 
    description: 'Building immersive user interfaces with modern frameworks and smooth UX.', 
    icon: Layout 
  },
  { 
    id: 'fullstack', 
    name: 'Full Stack Engineer', 
    description: 'Handling end-to-end features from server logic to client-side interactivity.', 
    icon: Layers 
  },
];

interface RoleSelectorProps {
  selectedRole: string | null;
  onRoleSelect: (roleId: string) => void;
}

export const RoleSelector = ({ selectedRole, onRoleSelect }: RoleSelectorProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ROLES.map((role) => (
        <motion.button
          key={role.id}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onRoleSelect(role.id)}
          className={`relative p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-4 ${
            selectedRole === role.id 
              ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)] active' 
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            selectedRole === role.id ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            <role.icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className={`font-mono font-bold mb-2 uppercase tracking-tight transition-colors ${
              selectedRole === role.id ? 'text-cyan-400' : 'text-slate-200'
            }`}>
              {role.name}
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
              {role.description}
            </p>
          </div>

          {selectedRole === role.id && (
            <motion.div 
              layoutId="glow"
              className="absolute inset-0 rounded-2xl border-2 border-cyan-500/50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};
