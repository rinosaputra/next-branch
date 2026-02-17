// Variable for default redirect URL after login
export const defaultRedirectURL = "/dashboard"

// Variable for OAuth providers
export const oauthProviders = {
  label: "Or continue with",
  google: {
    label: "Login with Google",
    image: "/images/google.svg",
  },
  // You can add more providers here
}

// Variable for navigation links (auth)
export const authNavigationLinks = {
  signup: {
    label: "Don't have an account?",
    linkLabel: "Sign up",
    href: "/signup",
  },
  forgotPassword: {
    label: "Forgot your password?",
    linkLabel: "Reset it",
    href: "/forgot-password",
  },
}

// Variable for form field configurations
export const formFieldConfig = {
  name: {
    label: "Name",
    placeholder: "John Doe",
  },
  email: {
    label: "Email",
    placeholder: "m@example.com",
  },
  password: {
    label: "Password",
    placeholder: "Enter your password",
  },
  repassword: {
    label: "Confirm Password",
    placeholder: "Re-enter your password",
  },
  rememberMe: {
    label: "Remember me",
  },
}
