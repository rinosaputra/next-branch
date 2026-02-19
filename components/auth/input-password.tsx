import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"

export function InputPassword(props: React.ComponentProps<"input">) {
  const [show, setShow] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput {...props} type={show ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label="Toggle password visibility"
          title={show ? "Hide password" : "Show password"}
          size="icon-xs"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? <EyeClosed /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
