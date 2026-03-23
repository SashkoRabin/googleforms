import { baseApi } from "./baseApi";
import type { Answer, Form, QuestionType, Response } from "@shared/types";

interface FormsResponse {
  forms: Form[];
}

interface FormResponse {
  form: Form | null;
}

interface GraphqlQueryResponse<TData> {
  data: TData;
}

interface CreateFormQuestionInput {
  title: string;
  description?: string;
  type: QuestionType;
  options?: string[];
  imageUrl?: string;
  required?: boolean;
}

interface CreateFormArgs {
  title: string;
  description?: string;
  imageUrl?: string;
  questions: CreateFormQuestionInput[];
}

interface CreateFormResponse {
  createForm: Form;
}

interface ResponsesResponse {
  responses: Response[];
}

interface SubmitResponseArgs {
  formId: string;
  answers: Answer[];
}

interface SubmitResponseResponse {
  submitResponse: Response;
}

export const formsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query<Form[], void>({
      query: () => ({
        url: "",
        method: "POST",
        body: {
          query: `
            query {
              forms {
                id
                title
                description
                imageUrl
                questions {
                  id
                  title
                  description
                  type
                  options
                  imageUrl
                  required
                }
              }
            }
          `,
        },
      }),
      transformResponse: (response: GraphqlQueryResponse<FormsResponse>) =>
        response.data.forms,
      providesTags: ["Forms"],
    }),
    getForm: builder.query<Form | null, string>({
      query: (id) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            query GetForm($id: ID!) {
              form(id: $id) {
                id
                title
                description
                imageUrl
                questions {
                  id
                  title
                  description
                  type
                  options
                  imageUrl
                  required
                }
              }
            }
          `,
          variables: { id },
        },
      }),
      transformResponse: (response: GraphqlQueryResponse<FormResponse>) =>
        response.data.form,
      providesTags: ["Forms"],
    }),
    createForm: builder.mutation<Form, CreateFormArgs>({
      query: ({ title, description, imageUrl, questions }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation CreateForm(
              $title: String!
              $description: String
              $imageUrl: String
              $questions: [QuestionInput]
            ) {
              createForm(
                title: $title
                description: $description
                imageUrl: $imageUrl
                questions: $questions
              ) {
                id
                title
                description
                imageUrl
                questions {
                  id
                  title
                  description
                  type
                  options
                  imageUrl
                  required
                }
              }
            }
          `,
          variables: {
            title,
            description,
            imageUrl,
            questions,
          },
        },
      }),
      transformResponse: (response: GraphqlQueryResponse<CreateFormResponse>) =>
        response.data.createForm,
      invalidatesTags: ["Forms"],
    }),
    getResponses: builder.query<Response[], string>({
      query: (formId) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            query GetResponses($formId: ID!) {
              responses(formId: $formId) {
                id
                formId
                answers {
                  questionId
                  value
                  values
                }
              }
            }
          `,
          variables: { formId },
        },
      }),
      transformResponse: (response: GraphqlQueryResponse<ResponsesResponse>) =>
        response.data.responses,
      providesTags: ["Forms"],
    }),
    submitResponse: builder.mutation<Response, SubmitResponseArgs>({
      query: ({ formId, answers }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation SubmitResponse($formId: ID!, $answers: [AnswerInput]) {
              submitResponse(formId: $formId, answers: $answers) {
                id
                formId
                answers {
                  questionId
                  value
                  values
                }
              }
            }
          `,
          variables: {
            formId,
            answers,
          },
        },
      }),
      transformResponse: (response: GraphqlQueryResponse<SubmitResponseResponse>) =>
        response.data.submitResponse,
      invalidatesTags: ["Forms"],
    }),
  }),
});

export const {
  useGetFormsQuery,
  useGetFormQuery,
  useCreateFormMutation,
  useGetResponsesQuery,
  useSubmitResponseMutation,
} = formsApi;
