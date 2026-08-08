"use client"

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { MailCheck } from "lucide-react";
import apiClient, { ensureCsrfCookie, isAxiosError } from "@/lib/api-client";
import { toast } from "@/components/ui/toast";
import { ValidationErrorResponse } from "@/types/api-error";

export default function Form() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setIsButtonLoading(true);

      await ensureCsrfCookie()
      const response = await apiClient.post("/api/forgot-password", { email: email }, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if(response.data.success){
        setIsButtonLoading(false);
        setSubmitted(true);
      }
    } catch (err) {
      toast.add({
        type: "error",
        description: "Unable to process your request at this time. Please try again later.",
        priority: "high",
      })
      setIsButtonLoading(false);
    }

  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <MailCheck className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
        <p className="text-slate-500 mb-8">
          If an account with that email exists, a password reset link has been sent.
        </p>
        <Link href="/login" className="inline-block w-full">
          <Button type="button" size="lg" variant="outline" className="w-full cursor-pointer">
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
            onChange={handleChange}
            aria-invalid={error ? true : false}
            name="email"
            type="email"
            id="email"
            placeholder="example@email.com"
          />
          { error && (<FieldError>{error}</FieldError>) }
        </Field>

        <Button type="submit" disabled={isButtonLoading} size="lg" className={`w-full cursor-pointer`}>
          Send reset link
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
