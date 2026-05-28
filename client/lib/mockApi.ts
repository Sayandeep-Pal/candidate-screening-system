import { CandidateSession, Question, AnswerResponse, InterviewResult } from './types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ROLES = [
  { id: 'backend', name: 'Backend Engineer', description: 'Systems, APIs, and databases.', icon: 'Server' },
  { id: 'aiml', name: 'AI/ML Engineer', description: 'Models, data pipelines, and research.', icon: 'Brain' },
  { id: 'data', name: 'Data Scientist', description: 'Analysis, stats, and visualization.', icon: 'Database' },
  { id: 'frontend', name: 'Frontend Engineer', description: 'UI, UX, and client-side logic.', icon: 'Layout' },
  { id: 'fullstack', name: 'Full Stack Engineer', description: 'End-to-end application development.', icon: 'Layers' },
];

const QUESTIONS: Record<string, string[]> = {
  backend: [
    "Explain the difference between SQL and NoSQL databases.",
    "How do you handle race conditions in a distributed system?",
    "Describe your experience with containerization and orchestration.",
  ],
  aiml: [
    "What is the vanishing gradient problem and how do you solve it?",
    "Explain the tradeoff between bias and variance.",
    "How does a transformer architecture differ from an RNN?",
  ],
  // Add more as needed...
};

export const mockApi = {
  createSession: async (roleId: string, resumeName: string): Promise<CandidateSession> => {
    await sleep(1500);
    return {
      sessionId: Math.random().toString(36).substring(7),
      candidateName: resumeName.split('.')[0] || 'Candidate',
      role: ROLES.find(r => r.id === roleId)?.name || 'Software Engineer',
    };
  },

  getQuestion: async (sessionId: string, questionNumber: number): Promise<Question> => {
    await sleep(1000);
    const domains = ['System Design', 'Algorithms', 'Soft Skills', 'Technical Depth'];
    return {
      questionId: `q-${questionNumber}`,
      questionText: `This is a sample question for question ${questionNumber}. Can you explain how you would approach this?`,
      domain: domains[questionNumber % domains.length],
      totalQuestions: 8,
      currentQuestionNumber: questionNumber,
    };
  },

  submitAnswer: async (sessionId: string, questionId: string, answer: string): Promise<AnswerResponse> => {
    await sleep(1200);
    const currentNum = parseInt(questionId.split('-')[1]);
    if (currentNum >= 8) {
      return { isComplete: true };
    }
    return {
      isComplete: false,
      nextQuestion: await mockApi.getQuestion(sessionId, currentNum + 1),
    };
  },

  getResults: async (sessionId: string): Promise<InterviewResult> => {
    await sleep(1500);
    return {
      sessionId,
      candidateName: "John Doe",
      role: "Backend Engineer",
      date: new Date().toLocaleDateString(),
      duration: "45 minutes",
      overallScore: "Strong Candidate",
      transcript: [
        {
          question: "Explain the difference between SQL and NoSQL databases.",
          answer: "SQL databases are relational, while NoSQL databases are non-relational. SQL databases use structured query language and have a predefined schema. NoSQL databases have dynamic schemas for unstructured data.",
          evaluation: "Excellent"
        },
        {
          question: "How do you handle race conditions?",
          answer: "I use locks, semaphores, or atomic operations depending on the environment.",
          evaluation: "Good"
        }
      ]
    };
  }
};
