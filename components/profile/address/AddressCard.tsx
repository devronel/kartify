import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

export function AddressCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Home
          <Badge>Default</Badge>
        </CardTitle>
        <CardAction>
          <Badge variant="secondary">Shipping</Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="font-medium">Juan Dela Cruz</p>
        <p className="text-sm text-muted-foreground">09171234567</p>
        <p className="mt-3 text-sm text-muted-foreground">
          123 Rizal Street, Unit 4B
        </p>
        <p className="text-sm text-muted-foreground">
          Brgy. San Jose, Calamba City, Laguna 4027
        </p>
      </CardContent>

      <CardFooter className="flex-wrap gap-2 border-t">
        <Button type="button" variant="outline" size="sm">
          <Pencil />
          Edit
        </Button>
        <Button type="button" variant="destructive" size="sm">
          <Trash2 />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
