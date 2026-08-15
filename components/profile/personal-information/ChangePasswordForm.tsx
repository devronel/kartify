import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Eye } from "lucide-react"

export function ChangePasswordForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Choose a strong password that you don&apos;t use anywhere else.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5">
          <Field>
            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
              />
              <InputGroupAddon
                align="inline-end"
                aria-label="Show current password"
              >
                <Eye />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
              />
              <InputGroupAddon
                align="inline-end"
                aria-label="Show new password"
              >
                <Eye />
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>
              Must be at least 8 characters and include a number.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Confirm New Password
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
              />
              <InputGroupAddon
                align="inline-end"
                aria-label="Show confirm password"
              >
                <Eye />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
      </CardContent>

      <CardFooter className="justify-end border-t">
        <Button type="button">Update Password</Button>
      </CardFooter>
    </Card>
  )
}
