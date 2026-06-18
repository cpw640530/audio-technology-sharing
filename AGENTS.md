# Project Rules

## Topic Card Expansion

- Every new or expanded topic card must include a corresponding lab unless the user explicitly says not to.
- A lab means all of the following are wired together:
  - `TopicLab` type in `src/content/knowledge.ts`
  - lab metadata on the topic card detail
  - an independent React lab component under `src/components/`
  - an `App.tsx` view route and `TopicDetails.tsx` open handler
  - focused tests in `src/App.test.tsx`
- Labs should follow the existing pattern: detailed explanation first, lab entry directly below it, then key points and related concepts.
- Prefer interactive visual controls that explain the card's core concept instead of static-only pages.
