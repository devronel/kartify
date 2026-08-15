import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

export function AddressFormDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button><Plus /> Add New Address</Button>} />

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>
            Update the details for this address.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="addressLabel">Label</FieldLabel>
            <Input
              id="addressLabel"
              name="addressLabel"
              type="text"
              defaultValue="Home"
            />
            <FieldDescription>
              A nickname to help you recognize this address later
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="addressType">Type</FieldLabel>
            <Select name="addressType" defaultValue="shipping">
              <SelectTrigger id="addressType" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="recipientName">Recipient Name</FieldLabel>
            <Input
              id="recipientName"
              name="recipientName"
              type="text"
              defaultValue="Juan Dela Cruz"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input id="phone" name="phone" type="tel" defaultValue="09171234567" />
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="addressLine1">Address Line 1</FieldLabel>
            <Input
              id="addressLine1"
              name="addressLine1"
              type="text"
              defaultValue="123 Rizal Street"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="addressLine2">Address Line 2</FieldLabel>
            <Input
              id="addressLine2"
              name="addressLine2"
              type="text"
              defaultValue="Unit 4B"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="barangay">Barangay</FieldLabel>
            <Input id="barangay" name="barangay" type="text" defaultValue="San Jose" />
          </Field>

          <Field>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input id="city" name="city" type="text" defaultValue="Calamba City" />
          </Field>

          <Field>
            <FieldLabel htmlFor="province">Province</FieldLabel>
            <Input id="province" name="province" type="text" defaultValue="Laguna" />
          </Field>

          <Field>
            <FieldLabel htmlFor="region">Region</FieldLabel>
            <Input
              id="region"
              name="region"
              type="text"
              defaultValue="Region IV-A (CALABARZON)"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
            <Input id="postalCode" name="postalCode" type="text" defaultValue="4027" />
          </Field>

          <Field>
            <FieldLabel htmlFor="country">Country</FieldLabel>
            <Input
              id="country"
              name="country"
              type="text"
              defaultValue="Philippines"
            />
          </Field>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="button">Save Address</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
