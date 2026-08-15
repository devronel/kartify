"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import { toast } from "@/components/ui/toast"

type UserData = {
  firstName: string,
  lastName: string,
  phone: string,
  dateOfBirth: string,
  gender: string | null
}

export function PersonalInfoForm() {

  const [data, setData] = useState<UserData>({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });

  const onChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
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

  const save = () => {
    console.log(data);
  }

  const getProfileInformation = async () => {
    try {
      
      const response = await apiClient.get('/api/account/profile')

      if(response.data.success){
        const payload = response.data.payload
        setData({
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: '',
          dateOfBirth: '',
          gender: ''
        })
      }

    } catch (error) {
      if(error instanceof Error){
        console.log(error.message)
      }

      toast.add({
        type: "error",
        description: "Something's wrong in the page.",
        priority: "high",
      })
    }
  }

  useEffect(() => {
    getProfileInformation();
  }, [])

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
              value={data.firstName}
              onChange={onChangedHandler}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={data.lastName}
              onChange={onChangedHandler}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={data.phone}
              onChange={onChangedHandler}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={onChangedHandler}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="gender">Gender</FieldLabel>
            <Select onValueChange={(value) => setStateData("gender", value)} name="gender" defaultValue="MALE">
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              readOnly
              defaultValue="juandelacruz@example.com"
            />
            <FieldDescription>
              Your sign-in email. It cannot be changed on this page.
            </FieldDescription>
          </Field>
        </div>
      </CardContent>

      <CardFooter className="justify-end border-t">
        <Button onClick={save} type="button">Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
