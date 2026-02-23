# Password Input Component

Production-grade password input with show/hide toggle and strength indicator.

## Features

- ✅ Show/hide password toggle
- ✅ Password strength indicator (5 levels)
- ✅ Real-time feedback messages
- ✅ Accessible (ARIA labels, keyboard navigation)
- ✅ Error state support
- ✅ Composable with forms (react-hook-form, Formik, etc.)

## Usage

### Basic Usage

\`\`\`tsx
import { PasswordInput } from "@/components/input/password"

export function LoginForm() {
  const [password, setPassword] = useState("")

  return (
    <PasswordInput
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter password"
    />
  )
}
\`\`\`

### With Strength Indicator

\`\`\`tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  showStrength
  showStrengthFeedback
/>
\`\`\`

### With react-hook-form

\`\`\`tsx
import { useForm } from "react-hook-form"
import { PasswordInput } from "@/components/input/password"

export function RegisterForm() {
  const { register, formState: { errors } } = useForm()

  return (
    <PasswordInput
      {...register("password")}
      error={!!errors.password}
      showStrength
    />
  )
}
\`\`\`

## Password Strength Levels

| Score | Label     | Color  | Criteria Met       |
| ----- | --------- | ------ | ------------------ |
| 0     | Very Weak | Red    | 0-1 requirements   |
| 1     | Weak      | Orange | 1 requirement      |
| 2     | Fair      | Yellow | 2-3 requirements   |
| 3     | Good      | Lime   | 4 requirements     |
| 4     | Strong    | Green  | All 5 requirements |

**Requirements:**
1. At least 8 characters
2. Uppercase letter
3. Lowercase letter
4. Number
5. Special character

## Props

| Prop                   | Type                  | Default | Description              |
| ---------------------- | --------------------- | ------- | ------------------------ |
| `showStrength`         | `boolean`             | `false` | Show strength indicator  |
| `showStrengthFeedback` | `boolean`             | `true`  | Show feedback messages   |
| `error`                | `boolean`             | `false` | Error state styling      |
| `value`                | `string`              | `""`    | Input value (controlled) |
| `onChange`             | `function`            | -       | Change handler           |
| ...rest                | `InputHTMLAttributes` | -       | Standard input props     |

## Accessibility

- ✅ ARIA labels for toggle button
- ✅ ARIA live region for strength indicator
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Focus management

## Related Components

- `InputGroup` - Wrapper for input with prefix/suffix
- `PasswordStrength` - Standalone strength indicator
- `Button` - Enhanced with icon support
\`\`\`
