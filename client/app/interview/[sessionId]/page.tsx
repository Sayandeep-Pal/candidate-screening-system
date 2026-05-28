"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/interview/Sidebar';
import { QuestionCard } from '@/components/interview/QuestionCard';
import { AnswerInput } from '@/components/interview/AnswerInput';
import { InterviewSkeleton } from '@/components/interview/SkeletonLoader';
import { Navbar } from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { Question } from '@/lib/types';

export default function InterviewPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<{ question: string; id: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState({ name: 'John Doe', role: 'Backend Engineer' });

  useEffect(() => {
    const initInterview = async () => {
      try {
        const firstQuestion = await api.getQuestion(sessionId as string, 1);
        setCurrentQuestion(firstQuestion);
      } catch (error) {
        console.error("Failed to load first question:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initInterview();
  }, [sessionId]);

  const handleSubmitAnswer = async (answer: string) => {
    if (!currentQuestion) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.submitAnswer(sessionId as string, currentQuestion.questionId, answer);
      
      setHistory(prev => [
        ...prev, 
        { question: currentQuestion.questionText, id: currentQuestion.questionId }
      ]);

      if (response.isComplete) {
        router.push(`/results/${sessionId}`);
      } else if (response.nextQuestion) {
        setCurrentQuestion(response.nextQuestion);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex pt-16">
        <Sidebar 
          candidateName={candidateInfo.name}
          role={candidateInfo.role}
          currentQuestion={currentQuestion?.currentQuestionNumber || 0}
          totalQuestions={currentQuestion?.totalQuestions || 8}
          history={history}
        />

        <main className="flex-grow overflow-y-auto px-4 py-12 md:px-12">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <InterviewSkeleton />
                </motion.div>
              ) : (
                <motion.div
                  key={currentQuestion?.questionId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  {currentQuestion && (
                    <>
                      <QuestionCard 
                        question={currentQuestion.questionText}
                        domain={currentQuestion.domain}
                        questionNumber={currentQuestion.currentQuestionNumber}
                      />
                      
                      <AnswerInput 
                        onSubmit={handleSubmitAnswer} 
                        isLoading={isSubmitting} 
                      />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Background Glows */}
      <div className="fixed top-1/4 -right-64 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -left-64 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
