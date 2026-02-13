# Auth Schema Documentation (`auth.schema.ts`)

## 1. Purpose of the File
The `auth.schema.ts` file is responsible for defining the structure and validation rules for user authentication data, specifically for the user registration process. It uses the **Zod** library to ensure that incoming data from the client (frontend) meets specific criteria (like length, format, and complexity) before it is processed by the backend or database.

## 2. Overall Validation Flow
1.  **Input**: The application receives a JSON object (usually from a form submission).
2.  **Schema Definition**: We define a "blueprint" (schema) of what valid data looks like.
3.  **Validation**: The input data is passed through the schema.
    *   **Success**: If the data matches the rules, Zod returns a clean, typed object.
    *   **Failure**: If any rule is violated, Zod throws an error containing detailed messages about what went wrong.
4.  **Type Inference**: TypeScript types are automatically generated from these schemas to ensure type safety throughout the codebase.

---

## 3. Code Breakdown & Explanation

### Imports
```typescript
import { z } from "zod";
```
*   **`z`**: The main object exported by the Zod library. It contains all the methods needed to define schemas (e.g., `z.string()`, `z.object()`).

### `registerUserSchema`
This constant defines the base validation rules for a user object.

```typescript
export const registerUserSchema = z.object({ ... });
```
*   **`z.object({...})`**: Indicates that the expected input is a JavaScript object (key-value pairs).

#### Field: `name`
```typescript
name: z
  .string()
  .trim()
  .min(2, "Name must be atleast 2 char long")
  .max(255, "Name must not excee 255 characters"),
```
*   **`z.string()`**: Ensures the value is a text string.
*   **`.trim()`**: Automatically removes whitespace from the beginning and end of the string.
*   **`.min(2, ...)`**: Fails if the string has fewer than 2 characters.
*   **`.max(255, ...)`**: Fails if the string has more than 255 characters.

#### Field: `userName`
```typescript
userName: z
  .string()
  .trim()
  .min(3, ...)
  .max(255, ...)
  .regex(/^[a-zA-Z0-9_-]+$/, ...),
```
*   **`.regex(...)`**: Validates the string against a Regular Expression.
    *   **Pattern**: `/^[a-zA-Z0-9_-]+$/` means the username can only contain uppercase letters, lowercase letters, numbers, underscores, and hyphens. No spaces or special symbols allowed.

#### Field: `email`
```typescript
email: z
  .string()
  .email("Please enter a valid email address")
  .trim()
  .max(255, ...)
  .toLowerCase(),
```
*   **`.email(...)`**: Checks if the string follows standard email formatting (e.g., `user@example.com`).
*   **`.toLowerCase()`**: Automatically converts the email to lowercase. This is crucial for storing emails consistently in the database (e.g., `User@Example.com` becomes `user@example.com`).

#### Field: `password`
```typescript
password: z
  .string()
  .min(8, ...)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, ...),
```
*   **`.min(8)`**: Enforces a minimum password length of 8 characters.
*   **`.regex(...)`**: Enforces complexity requirements.
    *   `(?=.*[a-z])`: Must contain at least one lowercase letter.
    *   `(?=.*[A-Z])`: Must contain at least one uppercase letter.
    *   `(?=.*\d)`: Must contain at least one number.

#### Field: `role`
```typescript
role: z
  .enum(["applicant", "employer"], { ... })
  .default("applicant"),
```
*   **`.enum([...])`**: Restricts the value to a specific set of allowed strings. The role *must* be either "applicant" or "employer".
*   **`.default("applicant")`**: If the `role` field is missing from the input, Zod will automatically inject "applicant" as the value.

### Type Definition: `RegisterUserData`
```typescript
export type RegisterUserData = z.infer<typeof registerUserSchema>;
```
*   **`z.infer<...>`**: This is a TypeScript utility. It looks at the `registerUserSchema` and automatically creates a TypeScript type describing the shape of the data. This prevents us from having to manually write an interface like `interface User { name: string; ... }`.

### `registerUserWithConfirmSchema`
This schema is used specifically for the registration form where the user must confirm their password.

```typescript
export const registerUserWithConfirmSchema = registerUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
   message : "Passwords don't match",
   path : ["confirmPassword"],
})
```
*   **`.extend({...})`**: Takes the existing `registerUserSchema` and adds new fields to it. Here, we add `confirmPassword`.
*   **`.refine(validatorFunction, options)`**: This allows for custom validation logic that involves multiple fields.
    *   **Logic**: `(data) => data.password === data.confirmPassword` checks if the two password fields are identical.
    *   **Options**:
        *   `message`: The error message to display if the check fails.
        *   `path`: Tells Zod to attach the error specifically to the `confirmPassword` field, so the frontend knows which input box to highlight.

---

## 4. Data Flow Description

1.  **API Request**: A user submits a registration form. The data arrives at the server (e.g., inside a Next.js Server Action or API route).
2.  **Schema Parsing**: The code calls `registerUserWithConfirmSchema.safeParse(requestData)`.
3.  **Validation**:
    *   Zod checks types (strings).
    *   Zod runs transformations (`trim`, `toLowerCase`).
    *   Zod runs constraints (`min`, `max`, `regex`, `email`).
    *   Zod runs refinements (checking if passwords match).
4.  **Result**:
    *   **If Valid**: The application receives a sanitized object. The `email` is lowercased, whitespace is trimmed, and we know for sure the passwords match.
    *   **If Invalid**: Zod returns an error object containing a list of issues (e.g., "Password too short", "Passwords don't match"). The application sends these errors back to the UI.

---

## 5. Examples

### Valid Input
This input passes all checks.
```json
{
  "name": "John Doe",
  "userName": "johndoe123",
  "email": "John.Doe@Example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "role": "applicant"
}
```

### Invalid Input (Example 1: Format Errors)
```json
{
  "name": "J",                     // Error: Name must be at least 2 chars
  "userName": "john doe",          // Error: Regex failed (no spaces allowed)
  "email": "not-an-email",         // Error: Invalid email format
  "password": "pass",              // Error: Min length 8, missing uppercase/number
  "confirmPassword": "pass"
}
```

### Invalid Input (Example 2: Password Mismatch)
```json
{
  "name": "Jane Doe",
  "userName": "janedoe",
  "email": "jane@example.com",
  "password": "Password123",
  "confirmPassword": "Password456" // Error: Passwords don't match (via .refine)
}
```
