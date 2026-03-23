import { forms, responses } from "./db";
import { v4 as uuid } from "uuid";
import { Form, Response, Question } from "@shared/types";
import {
  FormArgs,
  ResponsesArgs,
  CreateFormArgs,
  SubmitResponseArgs,
} from "../types";

export const resolvers = {
  Query: {
    forms: (): Form[] => forms,

    form: (_parent: unknown, { id }: FormArgs): Form | undefined =>
      forms.find((f) => f.id === id),

    responses: (
      _parent: unknown,
      { formId }: ResponsesArgs
    ): Response[] => responses.filter((r) => r.formId === formId),
  },

  Mutation: {
    createForm: (
      _parent: unknown,
      { title, description, imageUrl, questions }: CreateFormArgs
    ): Form => {
      const mappedQuestions: Question[] =
        questions?.map((q) => ({
          id: uuid(),
          title: q.title,
          description: q.description,
          type: q.type,
          options: q.options,
          imageUrl: q.imageUrl,
          required: q.required ?? false,
        })) ?? [];

      const form: Form = {
        id: uuid(),
        title,
        description,
        imageUrl,
        questions: mappedQuestions,
      };

      forms.push(form);
      return form;
    },

    submitResponse: (
      _parent: unknown,
      { formId, answers }: SubmitResponseArgs
    ): Response => {
      const form = forms.find((f) => f.id === formId);
      if (!form) {
        throw new Error("Form not found");
      }

      const response: Response = {
        id: uuid(),
        formId,
        answers,
      };

      responses.push(response);
      return response;
    },
  },
};
