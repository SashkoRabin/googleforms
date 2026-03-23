export enum QuestionType {
  TEXT = "TEXT",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  CHECKBOX = "CHECKBOX",
  DATE = "DATE",
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  options?: string[];
  imageUrl?: string;
  required?: boolean;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  value?: string;
  values?: string[];
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
}
