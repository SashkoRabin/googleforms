import { gql } from "apollo-server";

export const typeDefs = gql`
  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
  }

  type Question {
    id: ID!
    title: String!
    type: String!
    options: [String]
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
    type: String!
    options: [String]
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
      questions: [QuestionInput]
    ): Form!

    submitResponse(
      formId: ID!
      answers: [AnswerInput]
    ): Response!
  }
`;