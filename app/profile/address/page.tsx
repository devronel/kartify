import { AddressFormDialog } from "@/components/profile/address/AddressFormDialog"
import { AddressCard } from "@/components/profile/address/AddressCard"
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

export const metadata = {
  title: "Kartify - Address"
};

export default function AddressPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">My Addresses</h1>
          <p className="text-sm text-muted-foreground">
            Manage the addresses you use for shipping and billing.
          </p>
        </div>
        <AddressFormDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AddressCard />

        <Card>
          <CardHeader>
            <CardTitle>Office</CardTitle>
            <CardAction>
              <Badge variant="secondary">Billing</Badge>
            </CardAction>
          </CardHeader>

          <CardContent>
            <p className="font-medium">Juan Dela Cruz</p>
            <p className="text-sm text-muted-foreground">09179876543</p>
            <p className="mt-3 text-sm text-muted-foreground">
              456 Business Park Ave, Floor 12
            </p>
            <p className="text-sm text-muted-foreground">
              Brgy. Bel-Air, Makati City, Metro Manila 1209
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
            <Button type="button" variant="ghost" size="sm">
              Set as Default
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mom&apos;s House</CardTitle>
            <CardAction>
              <Badge variant="secondary">Both</Badge>
            </CardAction>
          </CardHeader>

          <CardContent>
            <p className="font-medium">Maria Dela Cruz</p>
            <p className="text-sm text-muted-foreground">09201112233</p>
            <p className="mt-3 text-sm text-muted-foreground">789 Family Road</p>
            <p className="text-sm text-muted-foreground">
              Brgy. Poblacion, Los Baños, Laguna 4030
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
            <Button type="button" variant="ghost" size="sm">
              Set as Default
            </Button>
          </CardFooter>
        </Card>
      </div>

      <DeleteAddressDialog />

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
