"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Trash2 } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React, { useRef, useState } from "react"
import ReactCrop, { centerCrop, Crop, cropToCanvas, cropToImg, makeAspectCrop, PixelCrop } from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import apiClient from "@/lib/api-client"
import { Spinner } from "@/components/ui/spinner"

export function ProfileAvatarCard() {

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
              src="https://i.pravatar.cc/150?img=12"
              alt="Juan Dela Cruz profile picture"
            />
            <AvatarFallback>JC</AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <div>
              <p className="text-base font-semibold">Juan Dela Cruz</p>
              <p className="text-sm text-muted-foreground">
                juandelacruz@example.com
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
              <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                <Trash2 />
                Remove Photo
              </Button>
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

  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)

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

  const save = async () => {

    if (!imgRef.current || !completedCrop) {
      console.warn("Image or crop data is missing!")
      return
    }

    const imageData = await getCroppedFile(imgRef.current, completedCrop, generateSecureFileName())
  
    try {
      setIsButtonLoading(true)
      const formData = new FormData()
      formData.append("file", imageData)
      
      const response = await apiClient.post('/api/account/profile/upload', formData)

      console.log(response.data)
      if(response.data.success){
        setIsButtonLoading(false)
        setCrop(undefined)
        setCompletedCrop(undefined)
        removeImage()
      }

    } catch (error) {
      if(error instanceof Error){
        console.log(error)
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
            Make changes to your profile here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
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


const getCroppedFile = ( image: HTMLImageElement, crop: PixelCrop, fileName: string): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      reject(new Error("No 2d context"))
      return
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = Math.round(crop.width * scaleX)
    canvas.height = Math.round(crop.height * scaleY)

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    )

    // 1. Extract the raw blob data stream
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"))
          return
        }

        // 2. Wrap the Blob directly into a standard native File object
        const finalFile = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        })

        resolve(finalFile)
      },
      "image/jpeg",
      0.9 // Image quality compression profile ratio
    )
  })
}

const generateSecureFileName = () => {
  const timestamp = Date.now();
  const secureRandom = crypto.randomUUID().split('-')[0];
  
  return `avatar-${timestamp}-${secureRandom}.jpg`;
}