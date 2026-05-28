"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, RefreshCw, CheckCircle2, FileText, Share2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { SummaryCard } from '@/components/results/SummaryCard';
import { TranscriptItem } from '@/components/results/TranscriptItem';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { api } from '@/lib/api';
import { InterviewResult } from '@/lib/types';

export default function ResultsPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  
  const [results, setResults] = useState<InterviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await api.getResults(sessionId as string);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [sessionId]);

  const handleDownload = () => {
    window.print();
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <h1 className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500">Evaluation_Complete</h1>
              </div>
              <h2 className="text-4xl font-bold text-slate-100 tracking-tight">Interview Summary</h2>
              <p className="text-slate-500 mt-2 font-mono text-xs uppercase tracking-widest">
                ID: {sessionId?.toString().substring(0, 8)}... • SECURE_DATA_LINK
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 w-4 h-4" />
                Share
              </Button>
            </div>
          </header>

          {results && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SummaryCard 
                  score={results.overallScore}
                  role={results.role}
                  date={results.date}
                  duration={results.duration}
                />
              </motion.div>

              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">Full_Transcript</h3>
                  <div className="flex-grow h-px bg-slate-900" />
                </div>

                <div className="space-y-2">
                  {results.transcript.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    >
                      <TranscriptItem 
                        index={i}
                        question={item.question}
                        answer={item.answer}
                        evaluation={item.evaluation}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div 
                className="mt-20 p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-100 uppercase tracking-tight font-mono">Ready for another track?</h3>
                  <p className="text-slate-500 font-sans max-w-md mx-auto">
                    Your performance data has been securely logged. You can start a new session 
                    for a different specialization or role at any time.
                  </p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => router.push('/setup')}
                  className="px-12 group"
                >
                  <RefreshCw className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  Start New Interview
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </div>
  );
}
