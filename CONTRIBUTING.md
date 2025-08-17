# Contributing

Thanks for helping improve Capital Markets Agent Factory!

## Dev setup
- Node 20+, Next.js 14
- `npm install` then `npm run dev`
- Keep keys in `.env.local` (never commit secrets).

## Coding standards
- TypeScript, strict mode
- Validate outputs with Zod; fail closed with helpful errors
- Keep LLM calls server-side only

## Pull requests
1. Create a feature branch
2. Add tests or sample data when relevant
3. Update README if UX or API changes
4. CI must pass typecheck/build

## Security
- Do not include client data or proprietary documents in the repo
- Never post secrets in issues/PRs
