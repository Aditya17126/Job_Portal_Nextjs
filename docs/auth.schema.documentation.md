# `auth.schema.ts` Documentation

## 1) Purpose of This File

`src/features/auth/auth.schema.ts` defines validation rules for user registration data using **Zod**.

It is responsible for:

- Defining what a valid registration payload looks like.
- Enforcing field-level constraints (name, username, email, password, role).
- Creating TypeScript types directly from schema rules so runtime validation and compile-time types stay in sync.
- Defining an extended schema that also validates `confirmPassword`.

In short: this file is the single source of truth for registration input shape and validation.

---

## 2) Line-by-Line Map (Quick Walkthrough)

- `Line 1`: Imports `z` from `zod`.
- `Lines 3-40`: Defines `registerUserSchema` object and all field validators.
- `Line 43`: Exports inferred type `RegisterUserData`.
- `Lines 45-50`: Extends base schema with `confirmPassword` and cross-field check.
- `Line 52`: Exports inferred type `RegisterUserWithConfirmData`.

This map is useful when presenting the file sequentially.

---

## 3) Full Source (for reference)

```ts
import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be atleast 2 char long")
    .max(255, "Name must not excee 255 characters"),

  userName: z
    .string()
    .trim()
    .min(3, "Username must be atleast 3 characters long")
    .max(255, "Username must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username  can only contain letters , numbers , underscores , and hyphens",
    ),

  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be atleast character long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at leaset one lowercase letter , one uppercase letter and one number",
    ),

  role: z
    .enum(["applicant", "employer"], {
      error: "Role must be either an applicant or employer",
    })
    .default("applicant"),
});

// z.infer automatically creates a TypeScript type from your Zod schema.
export type RegisterUserData = z.infer<typeof registerUserSchema>;

export const registerUserWithConfirmSchema = registerUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
   message : "Passwords don't match",
   path : ["confirmPassword"],
})

export type RegisterUserWithConfirmData = z.infer<typeof registerUserWithConfirmSchema>
```

---

## 4) Overall Validation Flow (Zod)

### 4.1 Schema Definition

`registerUserSchema` is built using `z.object({...})`, where each key maps to a validator chain.

### 4.2 Runtime Validation

In server code (`src/features/auth/server/auth.action.tsx`), input is validated with:

```ts
const { data: validatedData, error } = registerUserSchema.safeParse(formData);
```

- If valid: `validatedData` contains parsed/sanitized values (e.g., `trim`, `toLowerCase`, and default `role`).
- If invalid: `error` contains structured validation issues (`error.issues`).

### 4.3 Error Handling

Current action behavior:

- If `error` exists, it returns the first Zod issue message:
  - `return { status: "ERROR", message: error.issues[0].message }`
- If valid, it continues with business logic:
  - Duplicate email/username checks.
  - Password hashing.
  - User insertion.

So validation failure stops processing early and prevents DB operations.

---

## 5) Detailed Breakdown by Line Range

### 5.1 Import (Line 1)

**Code:** `import { z } from "zod";`

- `z` is the Zod namespace object.
- It provides schema builders like `z.object`, `z.string`, `z.enum`, and utility methods like `.refine`.

Why used:
- Central API for runtime input validation.

If missing:
- No Zod builders, file will not compile.

---

### 5.2 Main Schema Declaration (Line 3)

**Code:** `export const registerUserSchema = z.object({ ... })`

- `export`: makes schema reusable in other modules (like server action).
- `const`: immutable binding for schema definition.
- `z.object`: defines an object with fixed expected keys.

Why used:
- Registration expects structured object input.

If validation fails:
- `safeParse` returns `success: false` with an error tree.

---

### 5.3 Field Validators in `registerUserSchema` (Lines 4-39)

**Field:** `name`

```ts
name: z.string().trim().min(2).max(255)
```

- `z.string()`: must be a string.
- `.trim()`: removes leading/trailing spaces before checks/output.
- `.min(2)`: at least 2 chars.
- `.max(255)`: at most 255 chars.

Why used:
- Prevent empty/too-short names and oversized values.

Failure cases:
- Non-string value.
- `< 2` characters after trimming.
- `> 255` characters.

---

**Field:** `userName`

```ts
userName: z
  .string()
  .trim()
  .min(3)
  .max(255)
  .regex(/^[a-zA-Z0-9_-]+$/)
```

- `.min(3)`: avoids extremely short usernames.
- `.regex(/^[a-zA-Z0-9_-]+$/)`: allows only letters, numbers, `_`, `-`.
  - `^...$` means full string must match.
  - `+` means one or more characters.

Why used:
- Keeps usernames predictable and URL/identifier-friendly.

Failure cases:
- Spaces or special symbols like `@`, `.`, `#`, etc.

---

**Field:** `email`

```ts
email: z
  .string()
  .email()
  .trim()
  .max(255)
  .toLowerCase()
```

- `.email()`: checks standard email format.
- `.trim()`: removes accidental spaces.
- `.max(255)`: avoids overly long input.
- `.toLowerCase()`: normalizes case.

Why used:
- Ensures valid format and stable comparison/storage (`USER@X.COM` -> `user@x.com`).

Failure cases:
- Invalid format like `abc` or `user@`.
- Too long (>255).

Note:
- In this chain, `.email()` runs before `.trim()`. So a value like `" john@example.com "` can fail format check before trimming.

---

**Field:** `password`

```ts
password: z
  .string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
```

- `.min(8)`: minimum length.
- Regex uses positive lookaheads:
  - `(?=.*[a-z])` -> at least one lowercase.
  - `(?=.*[A-Z])` -> at least one uppercase.
  - `(?=.*\d)` -> at least one digit.

Why used:
- Enforces baseline password strength policy.

Failure cases:
- Too short.
- Missing required character category.

---

**Field:** `role`

```ts
role: z
  .enum(["applicant", "employer"], { error: "..." })
  .default("applicant")
```

- `z.enum([...])`: only accepts listed values.
- `.default("applicant")`: if role is missing, parsed output gets `"applicant"`.

Why used:
- Prevents unexpected role values and supports sensible default.

Failure cases:
- Provided value is not exactly `"applicant"` or `"employer"`.

---

### 5.4 Type Inference (Line 43)

**Code:** `export type RegisterUserData = z.infer<typeof registerUserSchema>;`

- `z.infer<...>` creates a TypeScript type from schema shape.
- Keeps type definitions synchronized with validation rules.

Why used:
- Avoids manually duplicating interfaces.

At compile-time:
- Helps editor/type-checking.

At runtime:
- No runtime validation by itself; schema still required.

---

### 5.5 Extended Schema With Confirm Password (Lines 45-50)

**Code:** `registerUserWithConfirmSchema`

```ts
export const registerUserWithConfirmSchema = registerUserSchema
  .extend({ confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

Parts:

- `.extend({ confirmPassword: z.string() })`
  - Reuses all base rules and adds one extra field.
- `.refine(predicate, config)`
  - Custom cross-field validation.
  - Predicate checks password equality.
  - `path: ["confirmPassword"]` attaches error to `confirmPassword`.

Why used:
- Base schema cannot compare two different fields on its own.

Failure cases:
- Password and confirm password differ.

Current usage note:
- `registrationAction` currently validates with `registerUserSchema`, not `registerUserWithConfirmSchema`.

---

### 5.6 Extended Type Inference (Line 52)

`export type RegisterUserWithConfirmData = z.infer<typeof registerUserWithConfirmSchema>`

- Type for payloads that include `confirmPassword`.
- Useful for form-level typing where both fields exist.

---

## 6) Data Movement: API Request -> Schema -> Result -> Error Handling

### 6.1 Input Arrives

- Client submits registration payload/form.
- Server action receives `formData`.

### 6.2 Schema Validation (`safeParse`)

`registerUserSchema.safeParse(formData)` does:

- Type checking (string/enum).
- Rule checking (`min`, `max`, `regex`, `email`).
- Transformations (`trim`, `toLowerCase`).
- Defaults (`role = "applicant"` when missing).

### 6.3 Validation Result Branch

- Valid branch:
  - `error` is `undefined`.
  - `validatedData` is trusted structured data.
- Invalid branch:
  - `error` contains one or more issues.
  - Action returns first issue message.

### 6.4 Business Logic After Validation

Only valid data continues to:

- Existing user lookup.
- Duplicate email/username handling.
- Password hashing with Argon2.
- DB insert.

This sequence prevents invalid payloads from reaching DB logic.

---

## 7) Valid and Invalid Input Examples

### 7.1 `registerUserSchema` examples

#### Valid

```json
{
  "name": "Aditya Kumar",
  "userName": "aditya_kumar-01",
  "email": "Aditya.Kumar@Example.com",
  "password": "SecurePass1",
  "role": "applicant"
}
```

Parsed output (important changes):

- `email` -> `"aditya.kumar@example.com"` (lowercased).
- Whitespace around trimmed fields removed.

#### Valid (role omitted)

```json
{
  "name": "Riya",
  "userName": "riya_123",
  "email": "riya@example.com",
  "password": "MyStrong9Pass"
}
```

Parsed output includes:

```json
{
  "role": "applicant"
}
```

#### Invalid (username has invalid chars)

```json
{
  "name": "Riya",
  "userName": "riya@123",
  "email": "riya@example.com",
  "password": "MyStrong9Pass",
  "role": "applicant"
}
```

Reason:
- `userName` fails regex due to `@`.

#### Invalid (weak password)

```json
{
  "name": "Riya",
  "userName": "riya123",
  "email": "riya@example.com",
  "password": "alllowercase",
  "role": "applicant"
}
```

Reason:
- Missing uppercase and number (regex failure).

---

### 7.2 `registerUserWithConfirmSchema` example

#### Invalid (password mismatch)

```json
{
  "name": "Aditya",
  "userName": "aditya_01",
  "email": "aditya@example.com",
  "password": "StrongPass1",
  "confirmPassword": "StrongPass2",
  "role": "employer"
}
```

Reason:
- Fails `.refine` check, error assigned to `confirmPassword`.

---

## 8) Keywords and Core Concepts Used in This File

- `import`: brings dependencies into file.
- `export`: exposes schema/types to other modules.
- `const`: immutable variable binding.
- `type`: TypeScript type alias.
- `typeof`: gets type of a value (`registerUserSchema`) for inference.
- `z.infer`: derives TS type from Zod schema.
- `object`, `string`, `enum`: Zod schema constructors.
- `trim`, `min`, `max`, `email`, `regex`, `toLowerCase`, `default`: chainable validators/transforms.
- `extend`: creates schema variant by adding fields.
- `refine`: custom validation (especially cross-field rules).
- `message`: custom error text.
- `path`: points error to a specific field.

---

## 9) Practical Notes for Manager Walkthrough

- This file validates **shape + quality** of registration input before DB work.
- It centralizes rules so API and type system stay aligned.
- `safeParse` provides controlled failure (no throw), making error handling predictable.
- Extended confirm-password schema exists for stricter form validation, but current registration action uses the base schema.
