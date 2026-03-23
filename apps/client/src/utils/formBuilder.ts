import { QuestionType } from "@shared/types";
import type { DraftFormValues, DraftQuestion } from "@/src/types/formBuilder";

const OPTION_CAPABLE_TYPES = new Set<QuestionType>([
  QuestionType.MULTIPLE_CHOICE,
  QuestionType.CHECKBOX,
]);

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createQuestion(type: QuestionType): DraftQuestion {
  return {
    id: createId("question"),
    title: "",
    description: "",
    type,
    options: OPTION_CAPABLE_TYPES.has(type) ? [""] : [],
    imageUrl: "",
    required: false,
  };
}

export function createInitialFormValues(): DraftFormValues {
  return {
    title: "",
    description: "",
    imageUrl: "",
    questions: [],
  };
}

export function hasOptions(type: QuestionType): boolean {
  return OPTION_CAPABLE_TYPES.has(type);
}

export function updateQuestion(
  questions: DraftQuestion[],
  questionId: string,
  updater: (question: DraftQuestion) => DraftQuestion
): DraftQuestion[] {
  return questions.map((question) =>
    question.id === questionId ? updater(question) : question
  );
}
