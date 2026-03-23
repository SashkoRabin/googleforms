import { QuestionType } from "@shared/types";

export interface DraftQuestion {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  options: string[];
  imageUrl: string;
  required: boolean;
}

export interface DraftFormValues {
  title: string;
  description: string;
  imageUrl: string;
  questions: DraftQuestion[];
}
