"use client"

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Eye, EyeOff, KeyRound } from "lucide-react";

interface ResetPassword {
  email: string,
  token: string
}

export default function Form(props: ResetPassword) {
  const [email, setEmail] = useState<string>(props.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (name === "email") setEmail(e.target.value);
    if (name === "password") setPassword(e.target.value);
    if (name === "confirmPassword") setConfirmPassword(e.target.value);

    setErrors(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    
    

    // setIsButtonLoading(true);
    // setTimeout(() => {
    //   setIsButtonLoading(false);
    //   setSubmitted(true);
    // }, 1200);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <KeyRound className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Password updated</h2>
        <p className="text-slate-500 mb-8">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link href="/login" className="inline-block w-full">
          <Button type="button" size="lg" className="w-full cursor-pointer">
            Back to sign in
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            value={email}
            onChange={handleChange("email")}
            name="email"
            type="email"
            id="email"
            placeholder="example@email.com"
            disabled
          />
          { errors.email && (<FieldError>{errors.email}</FieldError>) }
        </Field>

        <Field>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <InputGroup>
            <InputGroupInput
              value={password}
              onChange={handleChange("password")}
              aria-invalid={errors.password ? true : false}
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Create a new password"
            />
            <InputGroupAddon onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" align="inline-end">
              { showPassword ? <EyeOff /> : <Eye /> }
            </InputGroupAddon>
          </InputGroup>
          { errors.password && (<FieldError>{errors.password}</FieldError>) }
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <Input
            value={confirmPassword}
            onChange={handleChange("confirmPassword")}
            aria-invalid={errors.confirmPassword ? true : false}
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Re-enter your password"
          />
          { errors.confirmPassword && (<FieldError>{errors.confirmPassword}</FieldError>) }
        </Field>

        <Button type="submit" disabled={isButtonLoading} size="lg" className={`w-full cursor-pointer`}>
          Reset password
          {
            isButtonLoading ? <Spinner data-icon="inline-start" /> : ''
          }
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Remembered your password?{" "}
        <Link href="/login" className="text-slate-900 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
