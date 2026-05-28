import { CandidateSession, Question, AnswerResponse, InterviewResult } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = {
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/resume/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Failed to upload resume');
    return response.json();
  },

  createSession: async (role: string, resumeId: string): Promise<CandidateSession> => {
    const response = await fetch(`${API_URL}/session/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, resume_id: resumeId }),
    });
    
    if (!response.ok) throw new Error('Failed to create session');
    const data = await response.json();
    return {
      sessionId: data.session_id,
      candidateName: data.candidate_name,
      role: data.role,
    };
  },

  getQuestion: async (sessionId: string, questionNumber: number): Promise<Question> => {
    const response = await fetch(`${API_URL}/interview/${sessionId}/current-question`);
    if (!response.ok) throw new Error('Failed to fetch question');
    const data = await response.json();
    return {
      questionId: data.question_id,
      questionText: data.question_text,
      domain: data.domain,
      totalQuestions: data.total_questions,
      currentQuestionNumber: data.question_index + 1
    };
  },

  submitAnswer: async (sessionId: string, questionId: string, answer: string): Promise<AnswerResponse> => {
    const response = await fetch(`${API_URL}/interview/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: questionId, answer_text: answer }),
    });
    
    if (!response.ok) throw new Error('Failed to submit answer');
    const data = await response.json();
    
    if (data.status === 'completed') {
      return { isComplete: true };
    }
    
    return {
      isComplete: false,
      nextQuestion: {
        questionId: data.next_question.question_id,
        questionText: data.next_question.question_text,
        domain: data.next_question.domain,
        totalQuestions: 8,
        currentQuestionNumber: parseInt(data.next_question.question_id) + 1
      }
    };
  },

  getResults: async (sessionId: string): Promise<InterviewResult> => {
    const response = await fetch(`${API_URL}/results/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch results');
    const data = await response.json();
    
    return {
      sessionId: data.session.session_id,
      candidateName: data.session.candidate_name,
      role: data.session.role,
      date: new Date(data.session.created_at).toLocaleDateString(),
      duration: data.session.completed_at 
        ? `${Math.round((new Date(data.session.completed_at).getTime() - new Date(data.session.created_at).getTime()) / 60000)} mins`
        : 'N/A',
      overallScore: data.evaluation.overall_rating,
      transcript: data.transcript.map((t: any) => ({
        question: t.question,
        answer: t.answer,
        evaluation: t.evaluation
      }))
    };
  }
};
