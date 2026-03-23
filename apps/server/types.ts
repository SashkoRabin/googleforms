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
  imageUrl?: string;
  questions?: {
    title: string;
    description?: string;
    type: Form["questions"][number]["type"];
    options?: string[];
    imageUrl?: string;
    required?: boolean;
  }[];
}

export interface SubmitResponseArgs {
  formId: string;
  answers: Answer[];
}
