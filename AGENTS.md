# Project Rules

## Learning Continuity

- Maintain `src/content/topicLearning.ts` for every article: prerequisite knowledge, a concrete question answered here, a justified next reading, and an experiment goal only where a lab exists. Keep all supported languages complete; prerequisite chains must not cycle.
- Guides own conceptual explanations, derivations, model comparisons and general engineering context. Labs own controlled experiments, observations and result interpretation; keep essential formulas, units, assumptions and safety limits next to results, but do not repeat full article sections or model catalogs.
- Explain why the next processing stage is needed and what representation passes between stages. A sequence of arrows or unrelated links alone is not a learning transition. Do not invent runtime inference or measurements to make an experiment seem more complete.

## Content Credibility

- Every topic article and its existing lab must have an entry in `src/content/topicCredibility.ts`, with primary reference links, a manually maintained update date and explicit model assumptions/limits in all supported languages.
- Classify each demonstrated operation by actual implementation: `calculation` for computed values, `simulation` for simplified models/synthetic or preset data, and `illustration` for conceptual diagrams/animation. Mixed labs must identify each operation's scope; numerical output alone is not evidence of a real model or device measurement.
- For AI content, distinguish reference models from the code actually executed, including offline precomputed results, browser-side calculations, loaded weights and inference. Preserve model release/review dates separately from the maintenance date; never auto-stamp current dates as verification or claim benchmark accuracy without reproduction.
- Keep references and assumptions in the shared credibility panel; preserve nearby result-specific caveats. A removed lab should not be restored merely to add metadata.

## Request Efficiency Rewrite

- 默认直接执行用户请求，不再每次单独输出润色版。
- 仅当用户明确说“先润色请求”“优化请求”“帮我改成高性价比请求”等类似要求时，才根据 `efficiency-score-methodology.md` 输出润色后的请求并停止，等待用户确认或重新发送。
- 对普通实现请求，内部按高性价比原则执行：
  - preserve the user's goal, constraints, language, and latest instruction
  - improve useful output value over token spend
  - improve request density by bundling necessary context and reducing avoidable back-and-forth
  - improve execution clarity by making acceptance criteria, scope, files, tests, and delivery format explicit when inferable
  - reuse existing project patterns, previous decisions, and nearby implementation instead of rediscovering the same context
- Do not change the user's intended outcome, add unrelated scope, or ignore explicit instructions in the name of efficiency.
- If a request is ambiguous but a conservative high-efficiency interpretation is safe, proceed with that interpretation. Ask a concise clarification only when reasonable assumptions could cause wrong or destructive work.
- For implementation requests, generally inspect current code, make the smallest coherent change, keep required labs/tests wired, run focused and relevant full verification, then report concise results.

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
