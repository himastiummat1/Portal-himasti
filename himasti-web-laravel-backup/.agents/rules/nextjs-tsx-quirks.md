---
name: nextjs-tsx-quirks
description: Critical guardrails for Next.js 14+ Server Components and TSX generation via CLI.
trigger: always_on
---
# Next.js & TSX Generation Quirks

When generating Next.js code or executing bash commands to write TSX files, adhere to these strict technical guardrails:

1.  **NextResponse Imports**: NEVER import `NextResponse` from `next/dist/server/web/spec-extension/response`. ALWAYS import it strictly from `next/server`.
2.  **Bash Heredoc Escaping Risk**: When generating TSX files via `cat << 'EOF'`, ensure you use single quotes around `'EOF'`. NEVER manually escape template literals (e.g., writing `\${msg.role}` instead of `${msg.role}`) if the EOF is quoted. Doing so breaks Tailwind classes (e.g., rendering text invisible/white on white backgrounds).
3.  **Server Component Purity**: Do NOT call impure functions (like `Math.random()`, `Date.now()`, or UUID generation) directly inside the render body of a Next.js Server Component to avoid `react-hooks/purity` ESLint errors that will fail Vercel builds. Generate them on the client side via `useEffect`, inside event handlers, or pass them down cleanly.
