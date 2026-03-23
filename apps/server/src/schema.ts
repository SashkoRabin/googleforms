import { gql } from "apollo-server";

export const typeDefs = gql`
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  type Form {
    id: ID!
    title: String!
    description: String
    imageUrl: String
    questions: [Question!]!
  }

  type Question {
    id: ID!
    title: String!
    description: String
    type: QuestionType!
    options: [String]
    imageUrl: String
    required: Boolean!
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
  }

  type Answer {
    questionId: ID!
    value: String
    values: [String]
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  input QuestionInput {
    title: String!
    description: String
    type: QuestionType!
    options: [String]
    imageUrl: String
    required: Boolean
  }

  input AnswerInput {
    questionId: ID!
    value: String
    values: [String]
  }

  type Mutation {
    createForm(
      title: String!
      description: String
      imageUrl: String
      questions: [QuestionInput]
    ): Form!

    submitResponse(
      formId: ID!
      answers: [AnswerInput]
    ): Response!
  }
`;
