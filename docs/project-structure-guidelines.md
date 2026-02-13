# Project Structure & Naming Guidelines

This document outlines the architectural standards, folder structure, and naming conventions for our Next.js application. Adhering to these guidelines ensures scalability, maintainability, and a smooth developer experience.

## 1. Recommended Folder Structure

We follow a modular structure compatible with the Next.js App Router.

```text
src/
├── app/                    # Next.js App Router (Routes & Pages)
│   ├── (auth)/             # Route Group (e.g., login, register) - doesn't affect URL
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       ├── page.tsx
│   │       └── registrationAction.action.ts
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                # API Routes (for webhooks or external integrations)
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # React Components
│   ├── ui/                 # Reusable generic UI (Buttons, Inputs, Cards)
│   ├── forms/              # Form-specific components
│   └── layout/             # Header, Footer, Sidebar
├── lib/                    # Libraries & 3rd party configurations
│   ├── utils.ts            # Common utility functions (cn, formatters)
│   └── auth.ts             # Auth configuration
├── drizzle/                # Database Schema & Migrations
│   ├── schema.ts           # DB Tables definition
│   └── migrations/         # SQL migration files
├── config/                 # App Configuration
│   ├── db.ts               # Database connection instance
│   └── env.ts              # Environment variable validation
├── hooks/                  # Custom React Hooks
│   └── use-debounce.ts
└── types/                  # TypeScript Type Definitions
    └── index.d.ts
```

## 2. Naming Conventions

Consistency is key. We use specific casing styles to distinguish between different types of assets.

### 2.1 Files & Folders

| Type | Convention | Example |
| :--- | :--- | :--- |
| **Route Folders** | `kebab-case` | `src/app/job-listings/` |
| **Component Files** | `PascalCase` | `PrimaryButton.tsx`, `UserProfile.tsx` |
| **Utility/Hook Files** | `camelCase` | `formatDate.ts`, `useAuth.ts` |
| **Server Actions** | `camelCase` (suffix `.action.ts`) | `registerUser.action.ts` |
| **Next.js Special Files** | `lowercase` | `page.tsx`, `layout.tsx`, `loading.tsx` |

### 2.2 Code Identifiers

| Type | Convention | Example |
| :--- | :--- | :--- |
| **Variables** | `camelCase` | `const userCount = 10;` |
| **Booleans** | `camelCase` (prefix `is`, `has`, `should`) | `isValid`, `hasAccess` |
| **Functions** | `camelCase` | `function calculateTotal() {}` |
| **React Components** | `PascalCase` | `const JobCard = () => {}` |
| **Classes** | `PascalCase` | `class UserProfile {}` |
| **Constants** | `UPPER_SNAKE_CASE` | `const MAX_UPLOAD_SIZE = 5000;` |
| **Types/Interfaces** | `PascalCase` | `interface UserData {}` |

### 2.3 Database (Drizzle ORM)

| Type | Convention | Example |
| :--- | :--- | :--- |
| **Table Names** | `snake_case` (plural) | `users`, `job_postings` |
| **Column Names** | `snake_case` | `first_name`, `created_at` |
| **Foreign Keys** | `snake_case` (singular_id) | `user_id`, `company_id` |

### 2.4 APIs & Routes

- **URLs:** `kebab-case` (lowercase with hyphens).
  - Good: `/api/job-posts`
  - Bad: `/api/jobPosts`, `/api/JobPosts`

## 3. Best Practices & Organization

### 3.1 Colocation
Keep related things close. If a component is complex and has specific sub-components or helpers used *only* by it, keep them in the same folder.

```text
src/components/features/JobBoard/
├── JobBoard.tsx        # Main component
├── JobCard.tsx         # Sub-component used only here
└── job-utils.ts        # Helpers specific to JobBoard
```

### 3.2 Server Actions vs API Routes
In Next.js App Router, prefer **Server Actions** for form submissions and mutations. Use **API Routes** (`route.ts`) for webhooks or external integrations.

### 3.3 Type Safety
- Avoid `any`. Use `unknown` if the type is truly not known yet, or define a generic.
- Share types between database schema (Drizzle) and frontend using `zod` or Drizzle's type inference.

```typescript
// Example: Inferring type from Drizzle
import { users } from "@/drizzle/schema";
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## 4. Common Mistakes to Avoid

1.  **God Components:** Avoid creating single files with 500+ lines of code. Break them down into smaller, reusable components.
2.  **Hardcoded Strings:** Don't hardcode API URLs or configuration values deep in the code. Use environment variables (`process.env`) or a config file.
3.  **Inconsistent Imports:** Use absolute imports (`@/components/...`) instead of relative imports (`../../components/...`) to make refactoring easier.
4.  **Client Component Overuse:** Don't make the root layout a `"use client"` component. Push client logic down the tree to the leaves (buttons, inputs, interactive elements) to maximize Server Side Rendering (SSR) performance.

## 5. Real-World Examples

### Component Structure
```typescript
// src/components/ui/Button.tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => {
  return (
    <button 
      className={cn(
        "px-4 py-2 rounded",
        variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-200",
        className
      )} 
      {...props} 
    />
  );
};
```
