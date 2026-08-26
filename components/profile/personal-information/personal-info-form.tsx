"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import apiClient, { isAxiosError } from "@/lib/api-client"
import { toast } from "@/components/ui/toast"
import { ValidationErrorResponse } from "@/types/api-error"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/context/AuthContext"

type UserData = {
  firstName: string,
  lastName: string,
  phone: string,
  dateOfBirth: string,
  gender: string | null
}

type ValidationError = Record<string, string>

export function PersonalInfoForm(props: UserData) {

  const { setUser } = useAuth();
  const [data, setData] = useState<UserData>({
    firstName: props.firstName,
    lastName: props.lastName,
    phone: props.phone,
    dateOfBirth: props.dateOfBirth,
    gender: props.gender
  });
  const [errors, setErrors] = useState<ValidationError>({})
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)

  const onChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    
    setErrors(prev => {
      const { [name]: _, ...remainingErrors } = prev;
      return remainingErrors;
    })

    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const setStateData = (state: any, value: string | null) => {
    setData(prev => ({
      ...prev,
      [state]: value
    }))
  }

  const save = async () => {
    try {

      setIsButtonLoading(true)

      // --- Convert gender into null if empty string to avoid error from backend ---
      const payload = {
        ...data,
        gender: data.gender === '' ? null : data.gender
      }

      const response = await apiClient.post('/api/account/profile', payload, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      if(response.data.success){
        const payload = response.data.payload
        toast.add({
          type: 'success',
          description: "Profile Information Updated."
        })
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            fullName: payload.firstName + ' ' + payload.lastName
          };
        })
        setIsButtonLoading(false)
        setErrors({})
      }

    } catch (error) {
      if(error instanceof Error) {
        if(!isAxiosError(error)){
          toast.add({
            type: "error",
            description: "Something's wrong, Please try again.",
            priority: "high",
          })
          return
        }
        
        switch (error.status) {
          case 422:
            const data = error.response?.data as ValidationErrorResponse;
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

        setIsButtonLoading(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details below. Your email address is used to
          sign in and cannot be changed here.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              aria-invalid={errors.firstName ? true : false}
              value={data.firstName}
              onChange={onChangedHandler}
            />
            { errors.firstName && (<FieldError>{errors.firstName}</FieldError>) }
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              aria-invalid={errors.lastName ? true : false}
              value={data.lastName}
              onChange={onChangedHandler}
            />
            { errors.lastName && (<FieldError>{errors.lastName}</FieldError>) }
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              aria-invalid={errors.phone ? true : false}
              value={data.phone}
              onChange={onChangedHandler}
            />
            { errors.phone && (<FieldError>{errors.phone}</FieldError>) }
          </Field>

          <Field>
            <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              aria-invalid={errors.dateOfBirth ? true : false}
              value={data.dateOfBirth}
              onChange={onChangedHandler}
            />
            { errors.dateOfBirth && (<FieldError>{errors.dateOfBirth}</FieldError>) }
          </Field>

          <Field>
            <FieldLabel htmlFor="gender">Gender</FieldLabel>
            <Select
                onValueChange={(value) => setStateData("gender", value)} 
                name="gender" 
                value={data.gender}
              >
              <SelectTrigger aria-invalid={errors.gender ? true : false} id="gender" className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">--- Select Gender ---</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
            { errors.gender && (<FieldError>{errors.gender}</FieldError>) }
          </Field>
        </div>
      </CardContent>

      <CardFooter className="justify-end border-t">
        <Button onClick={save} type="button" disabled={isButtonLoading} className={'cursor-pointer'}>
          Save Changes
          {
            isButtonLoading ? <Spinner data-icon="inline-start" /> : '' 
          }
        </Button>
      </CardFooter>
    </Card>
  )
}
