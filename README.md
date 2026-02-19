# 📧 feature/email-setup

**Isolated integration branch for email infrastructure**

This branch establishes **production-grade email sending capabilities** for the **next-branch** fullstack architecture. It focuses exclusively on infrastructure—email client configuration, sending utility, and React Email primitives—without implementing specific templates.

---

## 🎯 Purpose

This branch is part of the **branch-based evolution strategy** used in `next-branch`. It provides foundational email infrastructure:

- **Email service integration** (Resend)
- **Type-safe sending utility** with development & production modes
- **React Email support** for email-compatible components
- **Centralized email client** (single instance pattern)
- **Development-friendly testing** (console logging without API calls)

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
| `@react-email/render` (dev) | ^1.x.x | Server-side React → HTML rendering |

### Infrastructure Components

| File | Purpose |
|------|---------|
| `/lib/email/client.ts` | Resend client instance |
| `/lib/email/send.ts` | Type-safe email sending utility |
| `/lib/email/components/email-layout.tsx` | Base email layout (optional) |
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

#### **React Email for Templates**

| Feature | Benefit |
|---------|---------|
| **Email-Safe Components** | Guaranteed compatibility with all email clients |
| **Live Preview** | Instant feedback during development |
| **Type-Safe** | Catch errors at compile time |
| **Automatic Inline CSS** | No manual style inlining needed |
| **Industry Standard** | Used by Stripe, Twilio, Notion |

**vs Alternatives:**
- **Plain HTML/CSS:** Hard to maintain, no type safety, manual inline styles
- **Plain React:** May break in email clients, no preview server
- **Template strings:** No reusability, no component logic

---

### Why Infrastructure Only?

**Separation of Concerns:**

```
Infrastructure (this branch)
├── Email client (Resend)
├── Sending utility (sendEmail)
├── React Email rendering
└── Base layout (optional)

Feature Branches (consumers)
├── Specific templates (verification, reset, etc.)
├── Business logic (when to send)
└── Integration with auth/notifications/etc.
```

**Benefits:**
- ✅ **Single responsibility** – Infrastructure focused
- ✅ **Clear ownership** – Templates owned by features
- ✅ **No bloat** – Only foundational components
- ✅ **Reusable** – Any feature can use `sendEmail()`
- ✅ **Maintainable** – Changes isolated to infrastructure

---

## 📁 Directory Structure

```
/lib
  └── email/
      ├── client.ts                    # Resend client instance
      ├── send.ts                      # Email sending utility
      └── components/
          └── email-layout.tsx         # Base layout (optional)

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

### 3. Base Email Layout (Optional Infrastructure)

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
} from '@react-email/components'

interface EmailLayoutProps {
  children: React.ReactNode
  preview?: string
}

export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && <Text style={{ display: 'none' }}>{preview}</Text>}
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={contentStyle}>{children}</Section>
          <Hr style={dividerStyle} />
          <Text style={footerStyle}>
            {process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Starter'}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle = { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }
const containerStyle = { maxWidth: '600px', margin: '0 auto', padding: '20px' }
const contentStyle = { backgroundColor: '#fff', borderRadius: '5px', padding: '40px' }
const dividerStyle = { borderColor: '#e6e6e6', margin: '20px 0' }
const footerStyle = { color: '#8898aa', fontSize: '12px', textAlign: 'center' }
```

**Purpose:**
- Consistent styling across all emails
- Responsive container
- Preview text support
- Footer with app branding

**Why infrastructure?**
- ✅ Reusable by all feature branches
- ✅ Enforces design consistency
- ✅ Single source of truth

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
  Preview,      // Preview text
} from '@react-email/components'
```

### Example Usage (Feature Branch)

```tsx
// feature/auth-ui: lib/email/templates/verification-email.tsx
import { EmailLayout } from '@/lib/email/components/email-layout'
import { Text, Button, Heading } from '@react-email/components'

interface VerificationEmailProps {
  userName: string
  verificationUrl: string
}

export function VerificationEmail({ userName, verificationUrl }: VerificationEmailProps) {
  return (
    <EmailLayout preview="Verify your email address">
      <Heading>Welcome to Next.js Starter!</Heading>
      <Text>Hi {userName},</Text>
      <Text>Thank you for signing up. Please verify your email address:</Text>
      <Button href={verificationUrl} style={buttonStyle}>
        Verify Email
      </Button>
      <Text style={{ fontSize: '14px', color: '#666' }}>
        This link expires in 24 hours.
      </Text>
    </EmailLayout>
  )
}

const buttonStyle = {
  backgroundColor: '#000',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '5px',
  textDecoration: 'none',
}
```

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
| **Any feature** | Custom templates | Using `sendEmail()` utility |

**Pattern:**
```
feature/email-setup (infrastructure)
  └── sendEmail() available

feature/auth-ui (consumer)
  ├── Uses sendEmail()
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
✅ **Inline CSS** – Automatic conversion for email clients
✅ **Responsive** – Works on desktop and mobile email clients
✅ **Preview text** – First line in email list view

### Developer Experience

✅ **Development mode** – Console logging without API calls
✅ **Live preview** – Hot reload email template development
✅ **Production-ready** – Domain verification, analytics, webhooks

---

## 🚧 Current State

### ✅ Completed (Infrastructure)
- [x] Dependencies installed (resend, react-email, @react-email/components)
- [x] Resend client configured
- [x] Email sending utility created
- [x] React Email rendering integrated
- [x] Base EmailLayout component (optional)
- [x] Development mode (console logging)
- [x] Production mode (actual sending)
- [x] Email preview setup
- [x] Environment validation

### 🔄 Not Included (Feature Branch Responsibility)
- [ ] Email templates (verification, password reset, etc.)
- [ ] Better Auth integration
- [ ] Template-specific styling
- [ ] Business logic (when to send emails)
- [ ] Feature-specific email flows

### 🎯 Will Be Used By
- `feature/auth-ui` → Email verification & password reset
- `feature/notifications` (future) → System notifications
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

await sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  html: '<h1>Hello World</h1>',
})
```

**Output (console):**
```
📧 Email (skipped in dev)
To: test@example.com
Subject: Test Email
HTML Content: <h1>Hello World</h1>...
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
      <Text>This is a test email</Text>
      <Button href="https://example.com">Click Me</Button>
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
  html: '<h1>Hello from Production</h1>',
})
```

**Verify:**
1. Check email inbox
2. Check Resend dashboard for delivery status
3. Check email headers (SPF, DKIM)

---

### Manual Test Endpoint (Optional)

```typescript
// app/api/test-email/route.ts (development only)
import { sendEmail } from '@/lib/email/send'
import { EmailLayout } from '@/lib/email/components/email-layout'
import { Text } from '@react-email/components'

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({ error: 'Development only' }, { status: 403 })
  }

  await sendEmail({
    to: 'test@example.com',
    subject: 'Test Email',
    react: (
      <EmailLayout preview="Test email">
        <Text>This is a test email from API route</Text>
      </EmailLayout>
    ),
  })

  return Response.json({ success: true })
}
```

**Test:**
```bash
curl -X POST http://localhost:3000/api/test-email
```

---

## 📚 Implementation Checklist

### Initial Setup
- [ ] Branch from `default` or `dev`
- [ ] Install dependencies (`resend`, `react-email`, `@react-email/components`)
- [ ] Create Resend account
- [ ] Get API key from [resend.com/api-keys](https://resend.com/api-keys)
- [ ] (Production) Verify domain at [resend.com/domains](https://resend.com/domains)

### Core Implementation
- [ ] Create `/lib/email/client.ts` (Resend instance)
- [ ] Create `/lib/email/send.ts` (sending utility with React Email support)
- [ ] Create `/lib/email/components/email-layout.tsx` (optional base layout)
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
- [ ] Test production mode (actual sending)
- [ ] Verify React component → HTML conversion
- [ ] Test error handling
- [ ] Test with multiple recipients

### Documentation
- [ ] Create branch README.md
- [ ] Document `sendEmail` API
- [ ] Document React Email integration
- [ ] Explain email preview workflow
- [ ] Clarify template ownership (feature branches)
- [ ] Add troubleshooting section

---

## 🧭 Branch Lifecycle

```
default
  └── feature/email-setup ← CURRENT (infrastructure only)
       ├── feature/auth-ui (adds verification & reset templates)
       ├── feature/notifications (future, adds notification templates)
       └── feature branches (add templates as needed)
            └── dev → main
```

**Current Status:** 🟡 Email infrastructure ready
**Dependencies:** None (branches from `default`)
**Next Step:** Merge into `dev`, feature branches add templates
**End Goal:** Universal email infrastructure for all features

---

## 📝 Contributing to This Branch

### Guidelines

1. **Keep infrastructure minimal** – Client + utility + React Email only
2. **No templates** – Templates belong in feature branches
3. **Document utility API** – Clear interface for consumers
4. **Test both modes** – Development (console) and production (actual)
5. **Handle errors gracefully** – Email failures shouldn't break flows
6. **Type everything** – Full TypeScript support

### Commit Message Format

```bash
git commit -m "email: <change>

- <what was changed>
- <why it was changed>
- <impact on email infrastructure>"
```

**Examples:**

```bash
git commit -m "email: add Resend client and sending utility

- Create /lib/email/client.ts with Resend instance
- Create /lib/email/send.ts with type-safe utility
- Add development mode (skip sending, console log)
- Add production mode (actual sending via Resend)
- Support HTML and React content

Email infrastructure foundation ready."
```

```bash
git commit -m "email: integrate React Email rendering

- Update sendEmail() to support React Email components
- Use @react-email/render for React → HTML conversion
- Maintain backward compatibility with plain HTML
- Enhanced logging for React components

Feature branches can now use React Email primitives."
```

```bash
git commit -m "email: add base EmailLayout component

- Create /lib/email/components/email-layout.tsx
- Reusable base layout for consistent styling
- Responsive container with footer
- Preview text support

Infrastructure component for feature branches."
```

---

## 🎯 Success Criteria

This branch is ready to merge when:

- ✅ Dependencies installed (resend, react-email, @react-email/components)
- ✅ Resend client configured with environment validation
- ✅ Email sending utility created with type-safe interface
- ✅ React Email rendering integrated
- ✅ Base EmailLayout component created (optional)
- ✅ Development mode working (console logging)
- ✅ Production mode working (actual sending)
- ✅ Email preview setup working (`npm run email:dev`)
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

### Issue: React Email preview not working

**Cause:** No preview files in `/emails/`

**Solution:**
```bash
# Create test template
echo 'export default function Test() { return <div>Test</div> }' > emails/test.tsx

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

### Resend Resources

- [API Keys](https://resend.com/api-keys) – Create and manage API keys
- [Domains](https://resend.com/domains) – Verify custom domains
- [Dashboard](https://resend.com/emails) – View email logs and analytics

### React Email Resources

- [Examples](https://react.email/examples) – Production email templates
- [Preview](https://demo.react.email) – Live component preview
- [GitHub](https://github.com/resend/react-email) – Source code

---

## 🔥 Philosophy Reminder

> **"Modular but not fragmented."**
> **"Clean integration, not package dumping."**

Email setup is **foundational infrastructure**:

- **Single responsibility** – Enable email sending
- **Feature-agnostic** – No templates, no business logic
- **Reusable** – Any feature can use `sendEmail()`
- **Type-safe** – Full TypeScript support
- **Production-ready** – Development & production modes
- **Email-compatible** – React Email guarantees delivery

This branch provides **infrastructure**.
Feature branches provide **templates and business logic**.

Every decision must serve:
- Long-term maintainability
- Architectural clarity
- Professional scalability

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
