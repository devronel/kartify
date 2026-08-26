import { AddressList } from "@/components/profile/address/address-list"

export const metadata = {
  title: "Kartify - Address"
};

export default function AddressPage() {

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <AddressList />
    </div>
  )
}
