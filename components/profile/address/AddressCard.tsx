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
import { Address } from "@/types/address"

export function AddressCard(props: Address) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          { props.label }
          {
            props.isDefault ? <Badge>Default</Badge> : null
          }
        </CardTitle>
        <CardAction>
          <Badge variant="secondary">
            { props.type }
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="font-medium">
          { props.recipientName }
        </p>
        <p className="text-sm text-muted-foreground">
          { props.phone }
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          { props.addressLine1 } { props.addressLine2 ? `, ${props.addressLine2}` : null }
        </p>
        <p className="text-sm text-muted-foreground">
          { `${props.barangay}, ${props.city}, ${props.province} ${props.postalCode}` }
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
