export type Role = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type CandidateSession = {
  sessionId: string;
  candidateName: string;
  role: string;
};

export type Question = {
  questionId: string;
  questionText: string;
  domain: string;
  totalQuestions: number;
  currentQuestionNumber: number;
};

export type AnswerResponse = {
  nextQuestion?: Question;
  isComplete: boolean;
};

export type InterviewResult = {
  sessionId: string;
  candidateName: string;
  role: string;
  date: string;
  duration: string;
  overallScore: string; // e.g., "Strong Candidate"
  transcript: {
    question: string;
    answer: string;
    evaluation?: string;
  }[];
};
