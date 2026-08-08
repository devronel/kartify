"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Eye, EyeOff } from "lucide-react";
import { isAxiosError } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

type UserCredential = {
  email: string,
  password: string
}

type ValidationError = Record<string, string>

export default function Form() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticate } = useAuth();
  const [data, setData] = useState<UserCredential>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({})
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.SubmitEvent) => {
      e.preventDefault();
      try {
        setIsButtonLoading(true)

        const response = await authenticate(data.email, data.password);

        if(response.success){
          setData({
            email: '',
            password: '',
          })
          setErrors({})
          setIsButtonLoading(false)
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err) {
        if(err instanceof Error){
          if(!isAxiosError(err)){
            toast.add({
              type: "error",
              description: "Something's wrong, Please try again.",
              priority: "high",
            })
            return
          }
  
          switch (err.status) {
            case 422:
            case 500:
              setErrors({
                email: "Invalid credentials"
              })
              break;
            default:
              toast.add({
                type: "error",
                description: "Something's wrong, Please try again.",
                priority: "high",
              })
              break;
          }

        }
        setIsButtonLoading(false)
      }
  };

  return (
      <>
          <button className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl py-3 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-slate-400">or sign in with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input value={data.email} onChange={handleChange} aria-invalid={errors.email ? true : false} name="email" type="email" id="email" placeholder="example@email.com" />
            { errors.email && (<FieldError>{errors.email}</FieldError>) }
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
              <InputGroupInput 
                value={data.password} 
                onChange={handleChange} 
                aria-invalid={errors.password ? true : false} 
                name="password" 
                type={showPassword ? "text" : "password"}
                id="password" 
                placeholder="Enter password" 
              />
              <InputGroupAddon onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" align="inline-end">
                { showPassword ? <EyeOff /> : <Eye /> }
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm font-medium text-slate-900 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={isButtonLoading} size="lg" className={`w-full cursor-pointer`}>
            Sign In
            {
              isButtonLoading ? <Spinner data-icon="inline-start" /> : '' 
            }
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          By continuing, you agree to our{" "}
          <Link href="#" className="underline hover:text-slate-600">Terms of Service</Link>
          {" "}and{" "}
          <Link href="#" className="underline hover:text-slate-600">Privacy Policy</Link>.
        </p>
      </>
  )
}