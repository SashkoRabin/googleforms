# Google Forms Lite Clone

Monorepo test task with a React/Next.js client and GraphQL server. The app supports:

- listing forms on the homepage
- creating a form with multiple question types
- attaching images to a form and to individual questions
- filling a form and submitting answers
- viewing all submitted responses for a form

## Stack

- `apps/client`: Next.js 16, React 19, TypeScript, Redux Toolkit, RTK Query, App Router
- `apps/server`: Node.js, Apollo Server, GraphQL, TypeScript
- `packages/shared`: shared TypeScript types used by both client and server
- data storage: in-memory arrays on the server

## Project Structure

```text
apps/
  client/   Next.js frontend
  server/   GraphQL API
packages/
  shared/   shared TypeScript types
```

## Requirements

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Run In Development

Start client and server together:

```bash
npm run dev
```

Applications:

- client: [http://localhost:3000](http://localhost:3000)
- GraphQL server: [http://localhost:4000](http://localhost:4000)

## Scripts

Root scripts:

```bash
npm run dev
npm run build
npm run lint
```

Workspace scripts:

```bash
npm run dev --workspace=apps/server
npm run dev --workspace=apps/client
npm run build --workspace=apps/server
npm run build --workspace=apps/client
npm run lint --workspace=apps/client
```

## Implemented Routes

- `/` homepage with created forms
- `/forms/new` form builder
- `/forms/[id]/fill` form filling page
- `/forms/[id]/responses` submitted responses page

## Notes

- The server uses an in-memory store, so forms and responses are reset after server restart.
- Images are stored as `data:` URLs for simplicity in this test task.
- No authentication is implemented, as required by the task.
