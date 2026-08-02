"use client"

import Link from "next/link";
import { useState } from "react";
import { toast } from "@/components/ui/toast"
import InputField from "@/components/shared/ui/InputField";
import apiClient, { isAxiosError } from "@/lib/api-client";
import { ValidationErrorResponse } from "@/types/api-error";

type UserData = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  agreed: boolean
}

type ValidationError = Record<string, string>

export default function Form() {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<ValidationError>({});
    const [data, setData] = useState<UserData>({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreed: false
    })

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;

      setData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
      e.preventDefault();
      try {
        const userInfo = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword
        }

        const response = await apiClient.post('/api/register', userInfo, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if(response.data.success){
          setData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreed: false
          })
          setErrors({})
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
              const data = err.response?.data as ValidationErrorResponse;
              setErrors(data.errors)
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
              <span className="bg-white px-4 text-slate-400">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <InputField
                id="firstName"
                label="First name"
                type="text"
                name="firstName"
                value={data.firstName}
                onChange={handleOnChange}
                required
              />

              <InputField
                id="lastName"
                label="Last name"
                type="text"
                name="lastName"
                value={data.lastName}
                onChange={handleOnChange}
                required
              />
            </div>

            <InputField
              id="email"
              label="Email address"
              type="email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              placeholder="you@example.com"
              error={errors.email ?? null}
              required
            />

            <div className="relative">
              <InputField
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                placeholder="Create a password"
                required
                className="pr-12"
                error={errors.password ?? null}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            <InputField
              id="confirmPassword"
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleOnChange}
              placeholder="Re-enter your password"
              required
            />

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agreed"
                checked={data.agreed}
                onChange={handleOnChange}
                required
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
              />
              <span className="text-sm text-slate-600">
                I agree to the{" "}
                <Link href="#" className="underline hover:text-slate-900">Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="underline hover:text-slate-900">Privacy Policy</Link>.
              </span>
            </label>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-slate-900 py-3 px-4 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 transition-colors"
            >
              Create account
            </button>
          </form>
        </>
    )
}
