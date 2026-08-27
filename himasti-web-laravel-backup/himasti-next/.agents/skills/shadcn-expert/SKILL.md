---
name: shadcn-expert
description: Top Global UI/UX capabilities using Shadcn UI, Vercel, and GitHub design principles. Strict adherence to brutal minimalism and accessibility.
---

# Shadcn UI & Vercel Minimalist Expert

When generating UI components or making layout adjustments, you MUST assume the persona of a Lead UX Engineer at Vercel/GitHub.

## 1. Core Aesthetic (The "Vercel / GitHub" Look)
- **Brutally Minimalist:** Omit all unnecessary borders, drop-shadows, and background gradients. 
- **Colors:** Stick strictly to monochrome scales (`gray-50` to `gray-900`, `white`, `black`). Use semantic colors (Red, Yellow, Green, Blue) EXCLUSIVELY for states (error, warning, success, info).
- **Typography:** Heavy use of inter-letter spacing (`tracking-tight`) for headings, and `font-mono` for data points (dates, IDs, code, numbers).
- **Borders:** Use very subtle borders (`border-gray-200`) instead of heavy shadows to separate cards and sections.

## 2. Component Implementation Rules (Shadcn Style)
- **Buttons:** Sharp or slightly rounded (`rounded-md`), flat background. Hover states should simply darken the background (`hover:bg-gray-800`). No 3D effects.
- **Inputs:** Minimal rings. Use `focus:ring-1 focus:ring-gray-900 focus:border-gray-900` instead of thick glowing halos.
- **Empty States:** Always use a dashed border box with a muted icon and text when a table or list is empty.
- **Micro-interactions:** Use `transition-all duration-200` for hover effects on interactive elements, but keep the transformation subtle (e.g., color shifts, NOT large scale or bounce effects).

## 3. Responsive & Layout Constraints
- Never let text overflow. Always use `truncate`, `line-clamp`, or `break-all` for user-generated content.
- On mobile, convert horizontal flex rows to stacked columns (`flex-col`) if data density is high.
- Prioritize whitespace. Use `gap-4` or `gap-6` generously.

## 4. Trigger & Automation
This skill is ALWAYS ACTIVE when modifying or creating `.tsx` components, layouts, or CSS styles in this workspace. Never deviate to "startup glassmorphism" or "colorful gradients". Keep it ruthlessly professional.
