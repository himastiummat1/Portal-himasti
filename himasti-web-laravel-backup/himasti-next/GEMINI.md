# HIMASTI Next.js Project Rules

## 1. Next.js App Router Rules
- **Server Components:** Do NOT pass event handlers (`onClick`, `onChange`, `onError`) to Server Components.
- **Impure Functions:** Never use `Math.random()` or side-effects directly inside the render body.
- **Imports:** ALWAYS import `NextResponse` from `next/server`. NEVER import from `next/dist/...`.

## 2. UI/UX & Design Constraints
- **ANTI-AI SLOP:** Strictly avoid poetic/dramatic copywriting, massive background gradients, and overused glassmorphism.
- **Utilitarian Minimalism:** Prioritize Vercel/GitHub style dashboards. Use solid backgrounds (white/gray), thin precise borders (`border-gray-200`), and monospace data points.
- **Mobile Responsiveness (CRITICAL):** Long strings (Dates, NIMs, Emails) MUST use `truncate`, `break-all`, or vertical stacking (`flex-col sm:flex-row`) to prevent flexbox containers from blowing up/overflowing on mobile.
- **Subtle Interactions:** Functional > Flashy. Use subtle `hover:shadow-lg` or tiny pulsing status dots (`animate-pulse`) to make the UI feel responsive without breaking the serious, academic tone.

## 3. Business Logic (Role-Based Access)
- The main `/admin` dashboard is a Portal Informasi for ALL members.
- Regular "Kader" (members) MUST have access to: `Bank Modul`, `Katalog Karya`, `Info Lomba`.
- Sensitive menus (`Keuangan`, `Surat`, `Data Kader`) must remain hidden from regular Kader.
