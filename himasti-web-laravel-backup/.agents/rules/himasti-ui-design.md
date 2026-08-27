---
name: himasti-ui-design
description: Enforces the Brutally Minimalist / Utilitarian design system for the Himasti Portal.
trigger: always_on
---
# Himasti UI Design System

When building or modifying UI components for the Himasti Portal, you MUST strictly adhere to the following design constraints:

1.  **Aesthetic Definition ("No AI Slop")**: The design must be "Brutally Minimalist", "Utilitarian", and "Pure Functional", identical to GitHub or Vercel's data-dense dashboards.
2.  **Banned Elements**: NO glowing orbs, NO heavy glassmorphism, NO gradient text, NO pulsing dots, and NO dramatic/poetic copywriting.
3.  **Core Elements**: Use solid backgrounds (white/dark gray) and strict borders (`border-gray-200`).
4.  **Mobile Layout Strictness**: Long text (like 12-digit NIMs, emails, or dates) MUST NOT overflow flexboxes on mobile. Always use `truncate`, `break-all`, or vertical stacking (`flex-col`) on small screens.
5.  **Typography**: Use monospace fonts for data points (NIM, IDs, Code Snippets).
