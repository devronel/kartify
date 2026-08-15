import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Trash2 } from "lucide-react"

export function ProfileAvatarCard() {
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
              <Button type="button" variant="outline" size="sm">
                <Camera />
                Change Photo
              </Button>
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
