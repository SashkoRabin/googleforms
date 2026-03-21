import { Form, Answer } from "@shared/types";

export interface FormArgs {
  id: string;
}

export interface ResponsesArgs {
  formId: string;
}

export interface CreateFormArgs {
  title: string;
  description?: string;
  questions?: {
    title: string;
    type: string;
    options?: string[];
  }[];
}

export interface SubmitResponseArgs {
  formId: string;
  answers: Answer[];
}