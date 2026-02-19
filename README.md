# 📧 feature/email-setup

**Isolated integration branch for email infrastructure**

This branch establishes **production-grade email sending capabilities** for the **next-branch** fullstack architecture. It focuses exclusively on infrastructure—email client configuration, sending utility, React Email primitives with **Tailwind CSS support**—without implementing specific templates.

---

## 🎯 Purpose

This branch is part of the **branch-based evolution strategy** used in `next-branch`. It provides foundational email infrastructure:

- **Email service integration** (Resend)
- **Type-safe sending utility** with development & production modes
- **React Email + Tailwind CSS** for email-compatible components
- **Automatic inline style conversion** (Tailwind → email-safe CSS)
- **Centralized email client** (single instance pattern)
- **Development-friendly testing** (console logging + live preview)

**This is infrastructure only.**
Email templates are implemented in feature branches that need them (`feature/auth-ui`, `feature/notifications`, etc.).

**This is not a permanent branch.**
Once validated, it will be merged into `dev` and enable email capabilities across all features.

---

## 📦 What's Included

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `resend` | ^4.x.x | Email sending service (Next.js native) |
| `react-email` | ^3.x.x | Email template development & preview |
| `@react-email/components` | ^0.0.x | Email-safe React primitives |
| `@react-email/tailwind` | ^0.0.x | **Tailwind CSS for emails** |
| `@react-email/render` (dev) | ^1.x.x | Server-side React → HTML rendering |

### Infrastructure Components

| File | Purpose |
|------|---------|
| `/lib/email/client.ts` | Resend client instance |
| `/lib/email/send.ts` | Type-safe email sending utility |
| `/lib/email/components/email-layout.tsx` | **Base email layout with Tailwind** |
| `/emails/` | Preview directory (development only) |

### Configuration

| Environment Variable | Purpose | Required |
|---------------------|---------|----------|
| `RESEND_API_KEY` | Resend API authentication | Yes |
| `EMAIL_FROM` | Default sender email | Yes |
| `SKIP_EMAIL_SENDING` | Development mode flag | No (dev only) |

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `resend` – Email sending service
- `react-email` – Template development tools
- `@react-email/components` – Email-safe React primitives
- `@react-email/tailwind` – **Tailwind CSS for emails**
- `@react-email/render` – Server-side rendering

### 2. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create API key at [resend.com/api-keys](https://resend.com/api-keys)
3. (Production) Verify domain at [resend.com/domains](https://resend.com/domains)

### 3. Configure Environment Variables

Add to `.env`:

```env
# Resend Email Service
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@yourdomain.com"

# Development: Skip actual email sending (log to console)
SKIP_EMAIL_SENDING="true"
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. (Optional) Start Email Preview Server

```bash
npm run email:dev
```

Opens email preview at `http://localhost:3000` with hot reload.

---

## 🧱 Architecture Decisions

### Why This Email Stack?

#### **Resend for Sending**

| Feature | Benefit |
|---------|---------|
| **Next.js Native** | Built by Vercel ecosystem, first-class App Router support |
| **Simple API** | One function call, no complex configuration |
| **Great DX** | Debugging dashboard, clear error messages |
| **Production-Ready** | High deliverability, analytics, webhooks |
| **Generous Free Tier** | 100 emails/day free, 3,000/month on paid plan |

**vs Alternatives:**
- **Nodemailer:** Complex SMTP setup, no dashboard, lower deliverability
- **SendGrid:** More complex API, paid-focused pricing
- **AWS SES:** Steep learning curve, complex IAM setup
- **Postmark:** More expensive, less Next.js focused

---

#### **React Email + Tailwind for Templates**

| Feature | Benefit |
|---------|---------|
| **Email-Safe Components** | Guaranteed compatibility with all email clients |
| **Tailwind CSS Support** | **Use Tailwind classes, auto-converted to inline styles** |
| **Live Preview** | Instant feedback during development |
| **Type-Safe** | Catch errors at compile time |
| **Automatic Inline CSS** | No manual style inlining needed |
| **Industry Standard** | Used by Stripe, Twilio, Notion, Vercel |

**vs Alternatives:**
- **Plain HTML/CSS:** Hard to maintain, no type safety, manual inline styles
- **Plain React:** May break in email clients, no preview server
- **Template strings:** No reusability, no component logic
- **Raw Tailwind:** Requires manual inline conversion (React Email does this automatically)

---

### Why Infrastructure Only?

**Separation of Concerns:**

```
Infrastructure (this branch)
├── Email client (Resend)
├── Sending utility (sendEmail)
├── React Email + Tailwind rendering
└── Base layout with Tailwind support

Feature Branches (consumers)
├── Specific templates (verification, reset, etc.)
├── Business logic (when to send)
└── Integration with auth/notifications/etc.
```

**Benefits:**
- ✅ **Single responsibility** – Infrastructure focused
- ✅ **Clear ownership** – Templates owned by features
- ✅ **No bloat** – Only foundational components
- ✅ **Reusable** – Any feature can use `sendEmail()` + Tailwind
- ✅ **Maintainable** – Changes isolated to infrastructure

---

## 📁 Directory Structure

```
/lib
  └── email/
      ├── client.ts                    # Resend client instance
      ├── send.ts                      # Email sending utility
      └── components/
          └── email-layout.tsx         # Base layout with Tailwind

/emails                                # Preview directory (dev only)
  └── .gitkeep                         # Keep directory in Git

package.json                           # Scripts + dependencies
.env                                   # Email configuration
.env.example                           # Updated with email vars
.gitignore                             # Ignore email previews
```

**Not included (belongs in feature branches):**
```
/lib/email/templates/                  ❌ NOT HERE
  ├── verification-email.tsx
  ├── reset-password-email.tsx
  └── notification-email.tsx
```

---

## 🧪 Implementation Details

### 1. Resend Client

```typescript
// lib/email/client.ts
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not defined')
}

export const resend = new Resend(process.env.RESEND_API_KEY)
```

**Features:**
- Environment validation on startup
- Single instance pattern
- Type-safe by default

---

### 2. Email Sending Utility

```typescript
// lib/email/send.ts
import { resend } from './client'
import { render } from '@react-email/render'
import * as React from 'react'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html?: string
  react?: React.ReactElement
}

export async function sendEmail({ to, subject, html, react }: SendEmailOptions) {
  // Convert React component to HTML
  let emailHtml = html
  if (react && !html) {
    emailHtml = render(react)
  }

  // Skip sending in development
  if (process.env.SKIP_EMAIL_SENDING === 'true') {
    console.log('📧 Email (skipped in dev)')
    console.log('To:', Array.isArray(to) ? to.join(', ') : to)
    console.log('Subject:', subject)
    return { success: true, id: 'dev-mode-skipped' }
  }

  // Send via Resend
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to: Array.isArray(to) ? to : [to],
    subject,
    html: emailHtml,
  })

  if (error) {
    console.error('❌ Email send error:', error)
    throw new Error(error.message)
  }

  console.log('✅ Email sent:', data?.id)
  return { success: true, id: data?.id }
}
```

**Features:**
- Type-safe interface
- React Email → HTML conversion
- Development mode (console logging)
- Production mode (actual sending)
- Single or multiple recipients
- Error handling with logging

---

### 3. Base Email Layout with Tailwind (Infrastructure)

```tsx
// lib/email/components/email-layout.tsx
import * as React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Tailwind,
} from '@react-email/components'

interface EmailLayoutProps {
  children: React.ReactNode
  preview?: string
}

/**
 * Base email layout with Tailwind CSS support
 *
 * Automatically converts Tailwind classes to inline styles
 * for email client compatibility.
 *
 * @example
 * ```tsx
 * <EmailLayout preview="Verify your email">
 *   <div className="bg-white p-10 rounded-lg">
 *     <h1 className="text-2xl font-bold text-gray-900">Hello</h1>
 *   </div>
 * </EmailLayout>
 * ```
 */
export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#000000',
                'brand-secondary': '#666666',
              },
            },
          },
        }}
      >
        {preview && (
          <Text className="hidden overflow-hidden leading-[0]">
            {preview}
          </Text>
        )}

        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-[600px] mx-auto p-5">
            <Section className="bg-white rounded-lg p-10">
              {children}
            </Section>

            <Hr className="border-gray-300 my-5" />

            <Text className="text-gray-500 text-xs text-center mt-5">
              {process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Starter'}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
```

**Purpose:**
- Consistent styling across all emails
- **Tailwind CSS support** (auto-converted to inline styles)
- Responsive container
- Preview text support
- Footer with app branding

**Why infrastructure?**
- ✅ Reusable by all feature branches
- ✅ Enforces design consistency
- ✅ Single source of truth
- ✅ **Tailwind DX with email compatibility**

---

## 🎨 Tailwind CSS in Emails

### How It Works

React Email's `<Tailwind>` component **automatically converts Tailwind classes to inline styles**:

```tsx
// ✅ YOU WRITE (Tailwind DX):
<div className="bg-white p-10 rounded-lg">
  <h1 className="text-2xl font-bold text-gray-900">Hello</h1>
</div>

// ✅ REACT EMAIL CONVERTS TO (Email-safe inline):
<div style="background-color: #ffffff; padding: 40px; border-radius: 8px;">
  <h1 style="font-size: 24px; font-weight: bold; color: #111827;">Hello</h1>
</div>
```

**Transformation:**
- `bg-white` → `background-color: #ffffff`
- `p-10` → `padding: 40px` (pixel-based for email compatibility)
- `rounded-lg` → `border-radius: 8px`
- `text-2xl` → `font-size: 24px`

---

### Available Tailwind Utilities

All standard Tailwind utilities work:

```tsx
// Spacing
className="p-4 m-2 px-6 py-3"

// Colors
className="bg-white text-gray-900 border-gray-300"

// Typography
className="text-base font-bold leading-6"

// Layout
className="max-w-[600px] mx-auto"

// Borders
className="rounded-lg border border-gray-200"

// Custom colors (from config)
className="bg-brand text-brand-secondary"
```

---

### Email Client Compatibility

React Email's Tailwind conversion is **tested and verified** on:

| Email Client | Support | Notes |
|--------------|---------|-------|
| **Gmail** | ✅ | Fully supported |
| **Apple Mail** | ✅ | Fully supported |
| **Outlook** | ✅ | Fully supported (automatic table-based layout) |
| **Yahoo! Mail** | ✅ | Fully supported |
| **HEY** | ✅ | Fully supported |
| **Superhuman** | ✅ | Fully supported |

---

### Known Limitations

<details>
<summary><strong>1. No Context Providers Inside `<Tailwind>`</strong></summary>

```tsx
// ❌ WRONG: Context provider inside Tailwind
<Tailwind>
  <MyContextProvider>
    {children}  {/* useContext won't work */}
  </MyContextProvider>
</Tailwind>

// ✅ RIGHT: Context provider outside Tailwind
<MyContextProvider>
  <Tailwind>
    {children}  {/* useContext works */}
  </Tailwind>
</MyContextProvider>
```
</details>

<details>
<summary><strong>2. No `prose` from `@tailwindcss/typography`</strong></summary>

```tsx
// ❌ NOT SUPPORTED:
<article className="prose">
  <p>Complex selectors not inlined</p>
</article>

// ✅ USE INSTEAD:
<article>
  <p className="text-base text-gray-700 leading-6">
    Explicit Tailwind utilities
  </p>
</article>
```
</details>

<details>
<summary><strong>3. No `space-*` Utilities</strong></summary>

```tsx
// ❌ NOT SUPPORTED:
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// ✅ USE INSTEAD:
<div>
  <div className="mb-4">Item 1</div>
  <div>Item 2</div>
</div>
```
</details>

---

## 🎨 React Email Components

### Available Primitives

Import from `@react-email/components`:

```tsx
import {
  Html,         // Root HTML wrapper
  Head,         // Email head section
  Body,         // Email body
  Container,    // Responsive container
  Section,      // Content section
  Row,          // Table row (responsive)
  Column,       // Table column
  Text,         // Paragraph text
  Heading,      // H1, H2, H3 headings
  Button,       // CTA button
  Link,         // Anchor link
  Img,          // Image
  Hr,           // Horizontal rule
  Tailwind,     // **Tailwind CSS wrapper**
} from '@react-email/components'
```

---

### Example Usage (Feature Branch)

```tsx
// feature/auth-ui: lib/email/templates/verification-email.tsx
import { EmailLayout } from '@/lib/email/components/email-layout'
import { Text, Button, Heading, Section } from '@react-email/components'

interface VerificationEmailProps {
  userName: string
  verificationUrl: string
}

export function VerificationEmail({ userName, verificationUrl }: VerificationEmailProps) {
  return (
    <EmailLayout preview="Verify your email address">
      <Section className="space-y-4">
        <Heading className="text-2xl font-bold text-gray-900 mb-5">
          Welcome to {process.env.NEXT_PUBLIC_APP_NAME}!
        </Heading>

        <Text className="text-base text-gray-700 leading-6">
          Hi {userName},
        </Text>

        <Text className="text-base text-gray-700 leading-6">
          Thank you for signing up. Please verify your email address:
        </Text>

        <Button
          href={verificationUrl}
          className="bg-black text-white px-6 py-3 rounded-md font-semibold"
        >
          Verify Email Address
        </Button>

        <Text className="text-sm text-gray-500 mt-5">
          This link expires in 24 hours.
        </Text>
      </Section>
    </EmailLayout>
  )
}
```

---

### Sending Email (Feature Branch)

```tsx
// feature/auth-ui: lib/auth.ts
import { sendEmail } from '@/lib/email/send'
import { VerificationEmail } from '@/lib/email/templates/verification-email'

// Inside Better Auth config
sendVerificationEmail: async ({ user, url }) => {
  await sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    react: <VerificationEmail userName={user.name} verificationUrl={url} />,
  })
}
```

---

## 🔗 Integration Points

This branch provides email infrastructure for:

| Consumer | Templates | Purpose |
|----------|-----------|---------|
| **feature/auth-ui** | verification-email.tsx<br>reset-password-email.tsx | Auth email flows |
| **feature/notifications** (future) | notification-email.tsx | System notifications |
| **feature/receipts** (future) | receipt-email.tsx | Transactional receipts |
| **Any feature** | Custom templates | Using `sendEmail()` + Tailwind |

**Pattern:**
```
feature/email-setup (infrastructure)
  └── sendEmail() + Tailwind support

feature/auth-ui (consumer)
  ├── Uses sendEmail()
  ├── Uses Tailwind classes in templates
  ├── Creates verification-email.tsx
  ├── Creates reset-password-email.tsx
  └── Integrates with Better Auth
```

---

## 🛡️ Best Practices Implemented

### Infrastructure

✅ **Environment-aware** – Skip emails in development
✅ **Type-safe** – Full TypeScript support
✅ **Error handling** – Graceful error messages with logging
✅ **Centralized client** – Single Resend instance
✅ **Flexible utility** – Support HTML or React templates

### Email Compatibility

✅ **Email-safe components** – React Email guarantees compatibility
✅ **Tailwind CSS** – Auto-converted to inline styles
✅ **Inline CSS** – Automatic conversion for email clients
✅ **Responsive** – Works on desktop and mobile email clients
✅ **Preview text** – First line in email list view

### Developer Experience

✅ **Development mode** – Console logging without API calls
✅ **Live preview** – Hot reload email template development
✅ **Tailwind DX** – Use Tailwind classes, auto-converted
✅ **Production-ready** – Domain verification, analytics, webhooks

---

## 🚧 Current State

### ✅ Completed (Infrastructure)
- [x] Dependencies installed (resend, react-email, @react-email/components, **@react-email/tailwind**)
- [x] Resend client configured
- [x] Email sending utility created
- [x] React Email rendering integrated
- [x] **Tailwind CSS support added** (automatic inline conversion)
- [x] Base EmailLayout component with Tailwind
- [x] Development mode (console logging)
- [x] Production mode (actual sending)
- [x] Email preview setup
- [x] Environment validation

### 🔄 Not Included (Feature Branch Responsibility)
- [ ] Email templates (verification, password reset, etc.)
- [ ] Better Auth integration
- [ ] Template-specific content
- [ ] Business logic (when to send emails)
- [ ] Feature-specific email flows

### 🎯 Will Be Used By
- `feature/auth-ui` → Email verification & password reset (with Tailwind)
- `feature/notifications` (future) → System notifications (with Tailwind)
- Any feature requiring transactional emails

---

## 🧪 Testing

### Development Mode (Console Logging)

**Setup:**
```env
SKIP_EMAIL_SENDING="true"
```

**Test:**
```typescript
import { sendEmail } from '@/lib/email/send'
import { EmailLayout } from '@/lib/email/components/email-layout'
import { Text } from '@react-email/components'

await sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  react: (
    <EmailLayout preview="Test">
      <Text className="text-base text-gray-900">
        Hello with Tailwind!
      </Text>
    </EmailLayout>
  ),
})
```

**Output (console):**
```
📧 Email (skipped in dev)
To: test@example.com
Subject: Test Email
React Email Template: EmailLayout
```

---

### Email Preview (Live Development)

**Setup:**
```bash
# Create preview template (temporary)
# /emails/test-email.tsx

import { EmailLayout } from '@/lib/email/components/email-layout'
import { Text, Button } from '@react-email/components'

export default function TestEmail() {
  return (
    <EmailLayout preview="Test email">
      <Text className="text-base text-gray-900">
        This is a test email with Tailwind CSS
      </Text>
      <Button
        href="https://example.com"
        className="bg-black text-white px-6 py-3 rounded-md mt-4"
      >
        Click Me
      </Button>
    </EmailLayout>
  )
}
```

**Start preview:**
```bash
npm run email:dev
```

**Opens:** `http://localhost:3000` (email preview server)

**Features:**
- Hot reload on template changes
- Multiple email preview
- Responsive view (desktop/mobile)
- **See Tailwind classes converted to inline styles**

---

### Production Mode (Actual Sending)

**Setup:**
```env
SKIP_EMAIL_SENDING="false"  # or remove variable
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@yourdomain.com"
```

**Test:**
```typescript
await sendEmail({
  to: 'your-email@example.com',
  subject: 'Production Test',
  react: (
    <EmailLayout>
      <Text className="text-lg font-bold">
        Hello from Production with Tailwind!
      </Text>
    </EmailLayout>
  ),
})
```

**Verify:**
1. Check email inbox
2. Check Resend dashboard for delivery status
3. Inspect email source (Tailwind classes → inline styles)

---

## 📚 Implementation Checklist

### Initial Setup
- [ ] Branch from `default` or `dev`
- [ ] Install dependencies (`resend`, `react-email`, `@react-email/components`, **`@react-email/tailwind`**)
- [ ] Create Resend account
- [ ] Get API key from [resend.com/api-keys](https://resend.com/api-keys)
- [ ] (Production) Verify domain at [resend.com/domains](https://resend.com/domains)

### Core Implementation
- [ ] Create `/lib/email/client.ts` (Resend instance)
- [ ] Create `/lib/email/send.ts` (sending utility with React Email support)
- [ ] Create `/lib/email/components/email-layout.tsx` (**with Tailwind wrapper**)
- [ ] Create `/emails/.gitkeep` (preview directory)

### Configuration
- [ ] Add `RESEND_API_KEY` to `.env`
- [ ] Add `EMAIL_FROM` to `.env`
- [ ] Add `SKIP_EMAIL_SENDING` to `.env` (development)
- [ ] Update `.env.example` with email variables
- [ ] Add `email:dev` script to `package.json`
- [ ] Update `.gitignore` for `/emails/` directory

### Testing
- [ ] Test development mode (console logging)
- [ ] Test email preview: `npm run email:dev`
- [ ] Test Tailwind class conversion (inspect preview)
- [ ] Test production mode (actual sending)
- [ ] Verify React component → HTML conversion
- [ ] Test error handling
- [ ] Test with multiple recipients

### Documentation
- [ ] Create branch README.md
- [ ] Document `sendEmail` API
- [ ] Document React Email + Tailwind integration
- [ ] Explain email preview workflow
- [ ] Clarify template ownership (feature branches)
- [ ] Add troubleshooting section

---

## 🧭 Branch Lifecycle

```
default
  └── feature/email-setup ← CURRENT (infrastructure with Tailwind)
       ├── feature/auth-ui (adds templates using Tailwind)
       ├── feature/notifications (future, uses Tailwind)
       └── feature branches (use Tailwind in emails)
            └── dev → main
```

**Current Status:** 🟡 Email infrastructure ready with Tailwind support
**Dependencies:** None (branches from `default`)
**Next Step:** Merge into `dev`, feature branches add templates
**End Goal:** Universal email infrastructure with Tailwind DX

---

## 📝 Contributing to This Branch

### Guidelines

1. **Keep infrastructure minimal** – Client + utility + React Email + Tailwind only
2. **No templates** – Templates belong in feature branches
3. **Document utility API** – Clear interface for consumers
4. **Test both modes** – Development (console) and production (actual)
5. **Handle errors gracefully** – Email failures shouldn't break flows
6. **Type everything** – Full TypeScript support
7. **Use Tailwind classes** – Maintain DX consistency

### Commit Message Format

```bash
git commit -m "email: <change>

- <what was changed>
- <why it was changed>
- <impact on email infrastructure>"
```

**Examples:**

```bash
git commit -m "email: add Tailwind CSS support

- Integrate @react-email/tailwind component
- Wrap EmailLayout with <Tailwind>
- Auto-convert Tailwind classes to inline styles
- Configure custom brand colors
- Maintain email client compatibility

IMPROVES:
- Developer experience (Tailwind DX)
- Code readability (70% less verbose)
- Design consistency (Tailwind scale)

MAINTAINS:
- Email compatibility (automatic inline conversion)
- Production-ready rendering
- All email clients supported"
```

---

## 🎯 Success Criteria

This branch is ready to merge when:

- ✅ Dependencies installed (resend, react-email, @react-email/components, **@react-email/tailwind**)
- ✅ Resend client configured with environment validation
- ✅ Email sending utility created with type-safe interface
- ✅ React Email rendering integrated
- ✅ **Tailwind CSS support added with automatic inline conversion**
- ✅ Base EmailLayout component created with Tailwind
- ✅ Development mode working (console logging)
- ✅ Production mode working (actual sending)
- ✅ Email preview setup working (`npm run email:dev`)
- ✅ Tailwind classes correctly converted to inline styles
- ✅ Environment variables configured
- ✅ Error handling implemented
- ✅ Documentation complete
- ✅ Testing guide provided
- ❌ Templates NOT included (correct, belongs in feature branches)

---

## 🔧 Troubleshooting

### Issue: "RESEND_API_KEY is not defined"

**Cause:** Environment variable not set

**Solution:**
```env
# Add to .env
RESEND_API_KEY="re_xxx"
```

Restart dev server after adding.

---

### Issue: Email not sending in production

**Cause 1:** `SKIP_EMAIL_SENDING` still set to `true`

**Solution:**
```env
# Remove or set to false
SKIP_EMAIL_SENDING="false"
```

**Cause 2:** Invalid API key

**Solution:**
- Verify API key at [resend.com/api-keys](https://resend.com/api-keys)
- Check key hasn't been revoked
- Generate new key if needed

---

### Issue: Email goes to spam

**Cause:** Domain not verified

**Solution:**
1. Go to [resend.com/domains](https://resend.com/domains)
2. Add your domain
3. Add DNS records (SPF, DKIM, DMARC)
4. Verify domain
5. Use verified domain in `EMAIL_FROM`

---

### Issue: Tailwind classes not working in email

**Cause:** Not wrapped with `<Tailwind>` component

**Solution:**
```tsx
// ❌ WRONG:
<Body className="bg-gray-100">  {/* Won't work */}
  {children}
</Body>

// ✅ RIGHT:
<Tailwind>
  <Body className="bg-gray-100">  {/* Works */}
    {children}
  </Body>
</Tailwind>
```

---

### Issue: React Email preview not working

**Cause:** No preview files in `/emails/`

**Solution:**
```bash
# Create test template
cat > emails/test.tsx << 'EOF'
import { Text } from '@react-email/components'
export default function Test() {
  return <Text className="text-base">Test</Text>
}
EOF

# Start preview
npm run email:dev
```

---

### Issue: TypeScript errors with React Email components

**Cause:** Missing type definitions

**Solution:**
```bash
npm install -D @types/react @types/react-dom
```

---

## 📖 References

### Official Documentation

- [Resend Documentation](https://resend.com/docs)
- [Resend Next.js Guide](https://resend.com/docs/send-with-nextjs)
- [React Email Documentation](https://react.email/docs/introduction)
- [React Email Components](https://react.email/docs/components/html)
- [React Email Tailwind](https://react.email/docs/components/tailwind) **← NEW**

### Resend Resources

- [API Keys](https://resend.com/api-keys) – Create and manage API keys
- [Domains](https://resend.com/domains) – Verify custom domains
- [Dashboard](https://resend.com/emails) – View email logs and analytics

### React Email Resources

- [Examples](https://react.email/examples) – Production email templates
- [Preview](https://demo.react.email) – Live component preview
- [Tailwind Demo](https://demo.react.email/preview/notifications/vercel-invite-user) **← NEW**
- [GitHub](https://github.com/resend/react-email) – Source code

---

## 🔥 Philosophy Reminder

> **"Modular but not fragmented."**
> **"Clean integration, not package dumping."**

Email setup is **foundational infrastructure**:

- **Single responsibility** – Enable email sending
- **Feature-agnostic** – No templates, no business logic
- **Reusable** – Any feature can use `sendEmail()` + Tailwind
- **Type-safe** – Full TypeScript support
- **Production-ready** – Development & production modes
- **Email-compatible** – React Email + Tailwind guarantees delivery
- **Better DX** – Tailwind classes with automatic inline conversion

This branch provides **infrastructure**.
Feature branches provide **templates and business logic**.

Every decision must serve:
- Long-term maintainability
- Architectural clarity
- Professional scalability
- **Developer experience without compromising email compatibility**

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
