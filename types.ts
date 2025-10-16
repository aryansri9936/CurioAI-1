
export interface StoredPdf {
  id: string;
  name: string;
  data: string; // base64 encoded
  textContent: string;
}

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
}

export interface SAQ {
  question: string;
  answer: string;
  explanation: string;
  topic: string;
}

export interface LAQ {
  question: string;
  answerKeywords: string[];
  explanation: string;
  topic: string;
}

export type Question = MCQ | SAQ | LAQ;

export enum QuestionType {
  MCQ = 'MCQ',
  SAQ = 'SAQ',
  LAQ = 'LAQ'
}

export interface QuizAttempt {
  id: string;
  pdfId: string;
  pdfName: string;
  date: number;
  score: number;
  totalQuestions: number;
  results: {
    question: string;
    isCorrect: boolean;
    topic: string;
  }[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
