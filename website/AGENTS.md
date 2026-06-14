<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LITHIUM ZERO-TRUST SECURITY STANDARDS
This project is built for high security. AI coding agents MUST strictly adhere to the following rules:

1. **Server-Side Validation:** All input from the client (forms, URL params, API payloads) MUST be validated using Zod. Never trust the client.
2. **Server Actions Security:** EVERY Server Action (`"use server"`) MUST verify the user's session (`auth()`) before executing any logic.
3. **Data Fetching:** Do NOT pass sensitive objects (like raw user records or tokens) directly from Server Components to Client Components. Extract only the safe fields needed for the UI.
4. **Environment Variables:** ONLY variables prefixed with `NEXT_PUBLIC_` are safe for the client. NEVER expose secret keys, database URIs, or bot tokens.
5. **Cookies & Tokens:** We use JWT. All auth cookies MUST be HTTPOnly, Secure (in prod), and SameSite=Lax/Strict.
6. **Middleware:** `/panel` and its sub-routes are protected by `middleware.ts`. Do not bypass this.
