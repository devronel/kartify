"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/toast";
import { isAxiosError } from "@/lib/api-client";

type UserCredential = {
  email: string,
  password: string
}

type LoginModalProps = {
  open: boolean,
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {

  const { authenticate } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [data, setData] = useState<UserCredential>({
    email: '',
    password: ''
  })


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData(prev => ({
      ...prev,
      [name]: value
    }));
  }


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
          onClose()
        }
      } catch (err: unknown) {

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

        setIsButtonLoading(false)

      }
  };


  useEffect(() => {
    if(!open){
      setErrors({})
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        
        <DialogHeader>

          <div className="lg:hidden flex items-center gap-2 mb-10">
            <svg className="w-8 h-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Kartify</span>
          </div>

          <h1 className="text-2xl text-center font-bold text-slate-900 mb-2">Sign in to your account</h1>
          <p className="text-slate-500 mb-8 text-center text-sm">
            New to Kartify?{" "}
            <Link href="/register" className="text-slate-900 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
          
          <Button variant={'outline'}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-400">or sign in with email</span>
            </div>
          </div>

        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="flex flex-col gap-4">

            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input 
                value={data.email} 
                onChange={handleChange} 
                aria-invalid={errors.email ? true : false} 
                name="email" 
                type="email" 
                id="email" 
                placeholder="Enter email address" 
              />
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

          </FieldGroup>

          <DialogFooter className="mt-5">
            <Button type="submit" disabled={isButtonLoading} size="lg" className={`w-full cursor-pointer`}>
              {
                isButtonLoading ? <Spinner data-icon="inline-start" /> : <LogIn /> 
              }
              Sign In
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}