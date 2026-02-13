# Troubleshooting & Error Reference

This document maintains a list of common errors encountered during development, their causes, and solutions. Use this as a reference when debugging issues in the application.

## 1. Form Submission Reloads Page

### Error Name
Unprevented Default Form Behavior

### Error Message
*No specific error message.* The page simply refreshes/reloads when the "Sign In" or "Register" button is clicked, and no logs appear in the console.

### Explanation
By default, an HTML `<form>` submits data to the current URL and reloads the page. In a React Single Page Application (SPA), we want to handle the submission with JavaScript (e.g., calling a Server Action) without refreshing.

### Possible Scenarios
- Clicking the "Sign In" button causes the browser tab to spin/refresh.
- `console.log` inside the submit handler is never seen because the page clears immediately.

### Resolution
Add `event.preventDefault()` at the very beginning of your submit handler.

```typescript
const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault(); // <--- Stops page reload
  // ... rest of logic
}
```

---

## 2. Server Action Logs Not Visible

### Error Name
Server-Side Logging Confusion

### Error Message
*No error message.* You expect to see `console.log(result)` in the browser's DevTools, but nothing appears.

### Explanation
Next.js Server Actions (`"use server"`) run entirely on the Node.js server. Any `console.log` inside these files will output to your **terminal** (where `npm run dev` is running), not the browser console.

### Possible Scenarios
- Debugging `auth.action.tsx` and wondering why variables aren't printing in Chrome DevTools.

### Resolution
- Check your **VS Code Terminal** or command prompt for the logs.
- If you need to see data in the browser, return it from the action and log it in the client component (e.g., inside `Login.tsx`).

---

## 3. Invalid Tailwind CSS Classes

### Error Name
CSS Typo / Invalid Utility Class

### Error Message
*Visual Error.* Styles do not apply (e.g., an icon is not centered or text color is default black).

### Explanation
Tailwind CSS classes must match exactly. If you misspell a class or combine two classes incorrectly, the browser ignores it.

### Possible Scenarios
- **Current Issue:** In `Login.tsx`, the class `transform-translate-y-1/2` is used. This is likely invalid as it combines two concepts or misses a space.
- **Previous Issue:** `text-muted-foregroundf` (extra 'f').

### Resolution
Correct the class names.

**Example Fix:**
```tsx
// Bad
<Mail className='absolute ... transform-translate-y-1/2 ...' />

// Good (Standard centering)
<Mail className='absolute ... -translate-y-1/2 ...' />
```

---

## 4. Generic Error Messages

### Error Name
Swallowed Exceptions

### Error Message
`"Unknown Error Occured ! Please Try Again Later"`

### Explanation
In `auth.action.tsx`, the `catch` block catches *all* errors (database connection failed, unique constraint violation, etc.) and returns the same generic message. This makes debugging impossible because you don't know *what* actually failed.

### Possible Scenarios
- Database is down, but the UI says "Unknown Error".
- User already exists, but the UI says "Unknown Error".

### Resolution
Log the actual error on the server and return more specific messages if possible.

```typescript
} catch (error) {
   console.error("Auth Action Error:", error); // Log the real error on server
   return { status: "ERROR", message: "Something went wrong. Check server logs." };
}
```

---

## 5. Argon2 Verify Crash with Invalid Hash

### Error Name
Invalid Password Hash Format (Argon2)

### Error Message
`Error: pchstr must contain a $ as first char`

### Explanation
`argon2.verify()` expects a valid Argon2 hash string from the database (usually starting with `$argon2...`). If the stored value is plain text, empty, or corrupted, verification fails and can crash the auth flow unless guarded.

### Possible Scenarios
- Legacy users were saved with plain text passwords before hashing was implemented.
- A manual DB insert/update stored a raw password instead of a hash.
- Password data was partially corrupted during migration/import.

### Resolution
- Add a safeguard before verify and ensure `user.password` exists.
- Ensure the stored value starts with `$` before calling `argon2.verify()`.
- If invalid, log the issue and return a safe auth error (e.g., `Invalid email or password`).
- Fix bad records by forcing password reset or re-hashing from a trusted source.
- Ensure all create/update auth flows always hash passwords before saving.
