---
name: himasti-portal
description: >
  Complete knowledge base for the HIMASTI UMMAT Portal (Next.js).
  Covers architecture, database quirks, security patterns, RBAC,
  UI conventions, and common pitfalls. Read this BEFORE writing
  any code for the portal.
---

# HIMASTI Portal — Agent Knowledge Base

> **Project**: Portal Himpunan Mahasiswa Teknik Informatika, Universitas Muhammadiyah Mataram  
> **Stack**: Next.js 16 (App Router, Turbopack) · Prisma ORM · PostgreSQL (Supabase) · NextAuth.js · Tailwind CSS  
> **Root**: `himasti-web-laravel-backup/himasti-next/`

---

## 1. Architecture Overview

```
himasti-next/
├── src/
│   ├── app/
│   │   ├── admin/           # Protected dashboard (requires login)
│   │   │   ├── layout.tsx   # Sidebar + RBAC menu visibility
│   │   │   ├── page.tsx     # Dashboard overview
│   │   │   ├── kader/       # Master Data Kader (CRUD + CSV export)
│   │   │   ├── keuangan/    # Finance management
│   │   │   ├── surat/       # Mail/letter archive
│   │   │   ├── rapat/       # Meeting & minutes
│   │   │   ├── roles/       # Role assignment (Super Admin only)
│   │   │   ├── adart/       # AD/ART constitution viewer + upload
│   │   │   ├── klub/        # IT clubs & interest groups
│   │   │   ├── artikel/     # Web articles
│   │   │   ├── modul/       # Code module bank
│   │   │   ├── lomba/       # Competition info + Devpost crawler
│   │   │   ├── survey/      # Survey & research
│   │   │   ├── karya/       # Project catalog (static data)
│   │   │   ├── devtools/    # Developer cheatsheets
│   │   │   ├── merchandise/ # Merch catalog
│   │   │   ├── TerminalEasterEgg.tsx  # Interactive mock terminal
│   │   │   └── HackerMode.tsx         # Secret dev mode (Vidyax riddle)
│   │   ├── api/
│   │   │   ├── auth/        # NextAuth handlers + registration
│   │   │   ├── chat/        # Groq AI chatbot endpoint
│   │   │   ├── adart/       # PDF/DOCX streaming endpoint
│   │   │   └── cron/        # Devpost crawler (protected by Bearer token)
│   │   ├── login/           # Login page
│   │   └── page.tsx         # Public landing page
│   ├── auth.ts              # NextAuth config + impersonation logic
│   ├── middleware.ts         # Route protection middleware
│   ├── lib/prisma.ts        # Prisma client singleton
│   └── components/
│       └── layout/TopNav.tsx # Top navigation bar
├── prisma/schema.prisma     # Database schema
├── public/uploads/          # User-uploaded files (surat, adart)
└── next.config.ts           # Security headers
```

---

## 2. Database — CRITICAL Quirks (Legacy Laravel)

> [!CAUTION]
> The PostgreSQL database was originally created by Laravel. It has structural
> differences from what Prisma expects. Violating these rules WILL cause
> data loss or runtime crashes.

### 2.1 NEVER use `prisma db push` or `prisma migrate`
- Laravel maps `id` columns to `BigInt`; Prisma defaults to `Int`. Running
  `db push` will attempt to cast all PKs from BigInt→Int and DROP Laravel
  cache tables (`sessions`, `cache`, `cache_locks`, `jobs`, etc.).
- **To add columns**: Use raw SQL via `prisma.$executeRawUnsafe()` or a
  standalone Node script, then re-run `npx prisma generate`.
- **To drop constraints**: Same — raw SQL only.

### 2.2 Missing `ON DELETE CASCADE`
- The legacy database lacks cascade constraints on most foreign keys.
- Deleting a `User` will NOT auto-delete their `DataKader`, `ModelHasRole`,
  or `Surat` records.
- **Required pattern**: Manually delete child rows first, then the parent.
  See `src/app/admin/kader/actions.ts → deleteKader()` for the canonical
  implementation.
- For `Surat` records: UNLINK (`user_id = null`) instead of deleting, to
  preserve organizational archives.

### 2.3 Orphaned Rows Crash Prisma
- If a required Prisma relation points to a deleted row (orphan), Prisma
  throws a fatal `Inconsistent query result: Field X is required, got null`.
- Before deleting any entity referenced by others, ALWAYS clean orphans
  first. See `fix_orphaned_roles.js` pattern.

### 2.4 Schema Sync
- After any raw SQL column addition, you MUST update `prisma/schema.prisma`
  and run `npx prisma generate` (NOT `db push`).
- The Prisma schema must reflect the actual DB state for the client to work.

---

## 3. Security Architecture

> [!IMPORTANT]
> Every server action, API route, and page MUST follow these security rules.
> No exceptions.

### 3.1 Authentication (NextAuth JWT)
- **Session strategy**: JWT (stateless, no DB session table).
- **Secret**: Stored in `AUTH_SECRET` env var. NEVER hardcode a fallback.
- **Providers**: Credentials (email + bcrypt) and Google OAuth.
- **Middleware** (`src/middleware.ts`): Protects all `/admin/*` routes. Redirects unauthenticated users to `/login`.

### 3.2 Authorization Pattern for Server Actions

Every `"use server"` function that mutates data MUST:

```typescript
import { auth } from "@/auth";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

// For role-restricted actions:
async function requireExecutive() {
  const session = await requireAuth();
  const userId = parseInt(session.user.id);
  const userRoles = await prisma.modelHasRole.findMany({
    where: { model_id: userId },
    include: { role: true }
  });
  const isExecutive = userRoles.some(r =>
    r.role.name === "super_admin" ||
    r.role.name.includes("ketua") ||
    r.role.name.includes("kabid")
  );
  if (!isExecutive) throw new Error("Akses Ditolak");
  return { session, userRoles };
}
```

### 3.3 Banned Security Anti-Patterns

> [!CAUTION]
> NEVER do these. They have been explicitly removed from the codebase.

- **Name-based auth bypass**: `session.user?.name?.includes("tes")` — anyone
  can register with that name and gain admin access.
- **Hardcoded secret fallback**: `process.env.SECRET || "readable_string"` —
  if the env var is missing, the fallback is publicly visible in source code.
- **`findFirst()` for user identity**: `prisma.user.findFirst()` returns a
  random user, NOT the logged-in user. Always use `session.user.id`.
- **Unprotected server actions**: Every exported `async function` in a
  `"use server"` file is a publicly callable API endpoint. Auth is mandatory.

### 3.4 File Upload Validation
- **Whitelist extensions only**: `pdf, doc, docx, jpg, jpeg, png`
- **Max size**: 10 MB
- **Filename**: Always generate random names (`crypto.randomBytes`). Never
  trust user-provided filenames.
- **Storage**: `public/uploads/<module>/` — files served statically.

### 3.5 Impersonation System
- Super Admin can temporarily adopt another user's session via a secure
  `httpOnly` cookie (`impersonated_user_id`).
- The `auth.ts` session callback verifies the REAL user (from JWT) is
  `super_admin` before honoring the cookie. Non-admins are ignored.
- Impersonation is set via `impersonateUser()` server action and cleared
  via `stopImpersonating()` server action (because `httpOnly` cookies
  cannot be deleted by client-side JS).
- The TopNav displays a red pulsing "STOP IMPERSONATING" badge when active.
- **ONLY `super_admin` can impersonate.** Not Kabid, not Sekretaris.

### 3.6 Security Headers (next.config.ts)
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: frame-ancestors 'self'
```

### 3.7 API Route Protection
- `/api/auth/*` — handled by NextAuth (public by design).
- `/api/chat` — public chatbot (rate-limited by Groq).
- `/api/adart` — public file streamer (AD/ART is readable by all cadres).
- `/api/cron/crawl-lomba` — protected by `Bearer` token (`CRON_SECRET` env).
- `/api/admin/kader/role` — protected by session + `super_admin` role check.

---

## 4. Role-Based Access Control (RBAC)

### 4.1 Official HIMASTI Roles (seeded in DB)
| Role Name | Scope |
|---|---|
| `super_admin` | God mode. CANNOT be assigned via UI. |
| `ketua_himpunan` | Chairman |
| `wakil_ketua` | Vice Chairman |
| `sekretaris_umum` | General Secretary → Surat module |
| `bendahara_umum` | Treasurer → Keuangan module |
| `kabid_*` | Division heads (e.g., `kabid_rnd`, `kabid_metkom`) |
| `wakil_kabid_*` | Vice division heads |
| `anggota_*` | Division members |
| `kader` | Default role for new registrations |
| `demisioner` | Alumni/retired members |
| `panitia_sementara` | Temporary committee role |

### 4.2 Menu Visibility Rules (layout.tsx)
| Menu | Accessible By |
|---|---|
| Data Kader | `super_admin`, `*kaderisasi*`, `*pengkaderan*` |
| Keuangan | `super_admin`, `*bendahara*` |
| Surat | `super_admin`, `sekretaris_umum` |
| Rapat | `super_admin`, `*ketua*`, `*sekretaris*`, `*bendahara*`, `*kabid*` |
| Artikel Web | `super_admin`, `*metkom*`, `*humas*` |
| AD/ART | Everyone (public) |
| Bank Modul, DevTools, Katalog Karya, Info Lomba | Everyone |
| Survey, Klub | `super_admin`, `*kabid*`, `*wakil*` |
| Roles | `super_admin` only |

### 4.3 Super Admin Protection Rules
- `super_admin` role MUST NOT appear in any role assignment dropdown.
- If a user already has `super_admin`, the role select is LOCKED (disabled).
- This prevents both privilege escalation AND accidental self-demotion.

---

## 5. Common Pitfalls & Solutions

### 5.1 Next.js Turbopack HMR Cache
- Overwriting a component file sometimes crashes Turbopack's HMR cache.
- **Fix**: Rename the internal React component to bust the module cache.
- Newly uploaded files to `public/` are invisible to the running dev server
  until restart. Use API routes to serve dynamic files instead.

### 5.2 React Hydration Mismatch
- NEVER use `Date.now()`, `Math.random()`, or `crypto.randomUUID()` in
  Server Component render bodies.
- These produce different values on server vs client, causing hydration errors.
- Use static values or generate them in `useEffect`/event handlers.

### 5.3 Bash Heredoc Escaping
- When generating TSX files via `cat << 'EOF'` (single-quoted EOF),
  do NOT manually escape `${}` or backticks.
- The single-quoted EOF already prevents shell interpolation.
- Over-escaping writes literal `\$` into the file, breaking template literals.

### 5.4 Static Page Caching
- Pages without `export const dynamic = "force-dynamic"` are aggressively
  cached during `npm run build`.
- Any page that reads from DB at runtime MUST export this directive.

### 5.5 Prisma Required Relations
- If a required relation (e.g., `user User @relation(...)`) has a broken FK
  (orphaned row), Prisma throws `Inconsistent query result` at runtime.
- Always clean orphans before querying or after deleting referenced entities.

---

## 6. Organization Context

- **Full name**: Himpunan Mahasiswa Teknik Informatika, Universitas Muhammadiyah Mataram
- **Abbreviation**: HIMASTI UMMAT
- **Founded**: April 21, 2022 (Mubes pertama)
- **8 Founders**: Arif Rahman, Samiul Ghozi, Husni Mubarok, Novianti, Luhur Budi, Fauzan, Alfian, Akrinul Hakim
- **Official Divisions**: Kemuhammadiyahan, Keorganisasian, Metkom/Kominfo, Litbang/R&D, Kewirausahaan, Mikat (Minat Bakat), Pengkaderan (Kaderisasi), Humas, Aksi & Advokasi
- **Values**: Muhammadiyah, Pancasila, Tri Dharma Perguruan Tinggi

---

## 7. Environment Variables Required

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
AUTH_SECRET="<random-32-byte-base64>"   # NEVER hardcode fallback
AUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# AI Chatbot
API_KEY_GROQ="gsk_..."

# Cron Protection
CRON_SECRET="<random-token>"
```

---

## 8. Development Checklist

Before writing any new module, verify:

- [ ] Server action has `await requireAuth()` or `await auth()` check
- [ ] Role-restricted actions verify roles from DB, not from session name
- [ ] File uploads validate extension whitelist and max size
- [ ] Page exports `dynamic = "force-dynamic"` if it reads from DB
- [ ] No `Date.now()` or `Math.random()` in server component render body
- [ ] Delete operations manually cascade to child tables (no DB CASCADE)
- [ ] Schema changes use raw SQL, NOT `prisma db push`
- [ ] New sidebar menu entries are gated by proper role checks in `layout.tsx`
- [ ] `super_admin` is never assignable via any UI dropdown
- [ ] All `dangerouslySetInnerHTML` uses static CSS only, never user input
