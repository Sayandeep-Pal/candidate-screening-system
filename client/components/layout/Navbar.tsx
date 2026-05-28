"use client";

import Link from 'next/link';
import { Terminal } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors">
            <Terminal className="w-5 h-5 text-cyan-500" />
          </div>
          <span className="font-mono text-lg font-bold tracking-tighter">
            INTERVIEW<span className="text-cyan-500">AI</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/setup" className="text-sm text-slate-400 hover:text-slate-100 transition-colors font-mono">
            NEW_SESSION
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <button className="text-xs text-slate-500 font-mono hover:text-cyan-500 transition-colors">
            v1.0.4-alpha
          </button>
        </div>
      </div>
    </nav>
  );
};
