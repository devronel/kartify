"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircleIcon, Camera } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import React, { useRef, useState } from "react"
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import apiClient from "@/lib/api-client"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/context/AuthContext"
import { toast } from "@/components/ui/toast"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { generateUniqueFileName, getCroppedFile } from "@/lib/helper"


export function ProfileAvatarCard() {

  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()

      reader.onload = () => {
        setImage(reader.result?.toString() || "");
      };

      reader.readAsDataURL(e.target.files[0])
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
          <Avatar className="size-24">
            <AvatarImage
              src={user?.profilePictureUrl}
              alt={`${user?.fullName} profile picture`}
            />
            <AvatarFallback>JC</AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <div>
              <p className="text-base font-semibold">{user?.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              { 
                image && (
                  <ProfilePictureModal 
                    image={image}
                    removeImage={removeImage}
                  />
                )
              }
              <label htmlFor="profilePhoto" className="flex items-center gap-2 border border-input px-2.5 py-1 rounded-md shadow-sm text-sm cursor-pointer">
                <input onChange={selectFile} type="file" id="profilePhoto" hidden />
                <Camera className="w-4 h-auto"/>
                Change Photo
              </label>
              <Input type="file" accept="image/*" className="hidden" />
            </div>
          </div>
        </div>
      </CardContent>
      
    </Card>
  )
}

type ImageType = {
  image: string,
  removeImage: () => void
}
const ProfilePictureModal = ({ image, removeImage }: ImageType) => {

  const { setUser } = useAuth();
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [isDisplayError, setIsDisplayError] = useState<boolean>(false)

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget

    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    )

    setCrop(initialCrop)
  }

  // --- Upload the profile image ---
  const save = async () => {

    if (!imgRef.current || !completedCrop) {
      toast.add({
        type: "error",
        description: "Something's wrong, Please try again.",
        priority: "high",
      })
      return
    }

    const imageData = await getCroppedFile(imgRef.current, completedCrop, generateUniqueFileName('avatar'))
  
    try {
      setIsButtonLoading(true)
      const formData = new FormData()
      formData.append("file", imageData)
      
      const response = await apiClient.post('/api/account/profile/upload', formData)

      if(response.data.success){
        const payload = response.data.payload
        setUser(prev => {
          if(!prev) return null;
          return {
            ...prev,
            profilePictureUrl: payload.url
          }
        })

        setIsDisplayError(false)
        setIsButtonLoading(false)
        setCrop(undefined)
        setCompletedCrop(undefined)
        removeImage()
      }

    } catch (error) {
      if(error instanceof Error){
        setIsDisplayError(true)
        setIsButtonLoading(false)
      }
    }
    
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {
          isDisplayError ? (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircleIcon />
              <AlertTitle>Something wen't wrong</AlertTitle>
            </Alert>
          ) : null
        }
        <ReactCrop 
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          aspect={1}
          onComplete={c => {
            setCompletedCrop(c)
          }}
        >
          <img ref={imgRef} alt="Crop me" src={image} onLoad={onImageLoad} />
        </ReactCrop>
        <DialogFooter>
          <DialogClose render={<Button onClick={removeImage} variant="outline">Cancel</Button>} />
          <Button onClick={save} disabled={isButtonLoading} className={`cursor-pointer`}>
            Save changes
            {
              isButtonLoading ? <Spinner data-icon="inline-start" /> : '' 
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}