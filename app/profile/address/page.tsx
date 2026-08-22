import { DeleteAddressDialog } from "@/components/profile/address/DeleteAddressDialog"
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
import { apiServer } from "@/lib/api-server"
import { AddressList } from "@/components/profile/address/AddressList"

export const metadata = {
  title: "Kartify - Address"
};

export default function AddressPage() {

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <AddressList />
      
      {/* <DeleteAddressDialog /> */}

      {/* Empty state (for reference when wiring up later)
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <MapPin className="size-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">No addresses yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first address to get started with shipping and billing.
            </p>
          </div>
          <Button type="button">
            <Plus />
            Add Your First Address
          </Button>
        </CardContent>
      </Card>
      */}
    </div>
  )
}
