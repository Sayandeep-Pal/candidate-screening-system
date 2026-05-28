"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Play, Cpu } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/setup/StepIndicator';
import { FileUpload } from '@/components/setup/FileUpload';
import { RoleSelector } from '@/components/setup/RoleSelector';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { api } from '@/lib/api';

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleStartInterview = async () => {
    if (!selectedRole || !file) return;
    
    setIsInitializing(true);
    try {
      // 1. Upload Resume
      const resumeResponse = await api.uploadResume(file);
      const resumeId = resumeResponse.resume_id;

      // 2. Create Session
      const session = await api.createSession(selectedRole, resumeId);
      router.push(`/interview/${session.sessionId}`);
    } catch (error) {
      console.error("Failed to initialize session:", error);
      setIsInitializing(false);
      alert("Failed to initialize session. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {isInitializing && <LoadingScreen />}
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Cpu className="w-5 h-5 text-cyan-500" />
              </div>
              <h1 className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-500">Session Initialization</h1>
            </div>
            <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Configure Your Technical Environment</h2>
            <p className="text-slate-500 mt-2 font-sans">
              Provide your professional credentials and select your domain of expertise.
            </p>
          </header>

          <StepIndicator currentStep={step} totalSteps={2} />

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FileUpload onFileSelect={setFile} />
                  <div className="mt-12 flex justify-end">
                    <Button 
                      onClick={() => setStep(2)} 
                      disabled={!file}
                      className="group"
                    >
                      Next Step
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RoleSelector 
                    selectedRole={selectedRole} 
                    onRoleSelect={setSelectedRole} 
                  />
                  <div className="mt-12 flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      onClick={() => setStep(1)}
                    >
                      <ChevronLeft className="mr-2 w-4 h-4" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleStartInterview} 
                      disabled={!selectedRole}
                      size="lg"
                      className="px-12 bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                      <Play className="mr-2 w-4 h-4 fill-current" />
                      Start Interview
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <footer className="mt-24 pt-8 border-t border-slate-900 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-2">Security_Protocol</h4>
              <p className="text-[10px] text-slate-600 font-mono leading-relaxed">
                All uploaded data is encrypted at rest and processed by our isolated LLM instances. 
                Data is purged 24 hours after session completion.
              </p>
            </div>
            <div className="text-right">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-2">System_Status</h4>
              <div className="flex items-center justify-end gap-2 text-[10px] text-emerald-500 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                NEURAL_LINK_ONLINE
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
