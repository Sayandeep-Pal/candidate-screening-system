"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Briefcase, PlayCircle, ShieldCheck, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    setParticles([...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100 + '%',
      y: Math.random() * 100 + '%',
      opacity: Math.random() * 0.5,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 20
    })));
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden mesh-gradient">
      <Navbar />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-500/20 rounded-full"
            initial={{ 
              x: particle.x, 
              y: particle.y,
              opacity: particle.opacity 
            }}
            animate={{ 
              y: [null, '-100%'],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: particle.duration, 
              repeat: Infinity, 
              ease: "linear",
              delay: particle.delay
            }}
          />
        ))}
      </div>

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
            >
              <Zap className="w-4 h-4 text-cyan-500" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400">Next-Gen Screening Engine</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
            >
              AI-Powered Technical <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Interviews, Tailored to You
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 font-sans"
            >
              Experience a precision-engineered screening process. Upload your resume, select your domain, 
              and prove your expertise in our immersive technical command center.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/setup">
                <Button size="lg" className="group">
                  Begin Interview
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </motion.div>
          </div>

          {/* 3-Step Explainer */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent hidden md:block -translate-y-1/2" />
            
            {[
              { icon: Upload, title: 'Upload Resume', desc: 'Our AI parses your experience to tailor the technical deep-dive.' },
              { icon: Briefcase, title: 'Select Role', desc: 'Choose from specialized engineering tracks designed by industry experts.' },
              { icon: PlayCircle, title: 'Start Interview', desc: 'Engage with our adaptive interviewer in a low-latency, real-time session.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="relative bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm group hover:border-cyan-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 text-cyan-500" />
                </div>
                <h3 className="font-mono text-lg font-bold mb-3 uppercase tracking-wider">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-mono text-xs text-slate-600">
                  0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-32 pt-12 border-t border-slate-900/50 flex flex-wrap justify-center gap-12 opacity-40 grayscale"
          >
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest"><Globe className="w-4 h-4" /> GLOBAL_SCALE</div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest"><ShieldCheck className="w-4 h-4" /> ENCRYPTED_DATA</div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest"><Zap className="w-4 h-4" /> SUB_SECOND_LATENCY</div>
          </motion.div>
        </div>
      </main>

      <footer className="py-8 px-4 border-t border-slate-900 bg-slate-950/50 text-center">
        <p className="font-mono text-[10px] text-slate-600 tracking-[0.3em] uppercase">
          &copy; 2026 PGAGI INTERVIEW_SYSTEM. ALL_RIGHTS_RESERVED.
        </p>
      </footer>
    </div>
  );
}
