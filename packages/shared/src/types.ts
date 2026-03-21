export enum QuestionType {
  TEXT = "TEXT",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  CHECKBOX = "CHECKBOX",
  DATE = "DATE",
}

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options?: string[];
}

export interface Form {
  id: string;
  title: string;
  description?: string;
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