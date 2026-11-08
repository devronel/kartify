import { useState } from "react"
import apiClient from "@/lib/api-client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { Address } from "@/types/address"
import { AlertCircle, Pencil, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { AddressFormEditDialog } from "./address-form-edit-dialog"
import { AddressFormDeleteDialog } from "./address-form-delete-dialog"

type AddressListContentProps = {
    addresses: Address[],
    syncUpdatedAddress: (address: Address) => void,
    onIsDefault: (address: Address) => void,
    fetchAddress: () => void,
    isFetchingData: boolean
    hasError: boolean
}
export default function AddressListContent ({ 
    addresses, 
    syncUpdatedAddress, 
    onIsDefault, 
    fetchAddress, 
    isFetchingData, 
    hasError 
}: AddressListContentProps) {

    const [address, setAddress] = useState<Address | null>(null)

    // --- Update Address Information ---
    const updateAddress = async (id: number) => {
        try {
            const response = await apiClient(`/api/account/address/${id}`)
            if(response.data.success){
                setAddress(response.data.payload)
            }
        } catch (error: any) {
            toast.add({
                type: "error",
                description: error.message
            })
        }
    }

    // --- Set Default Address
    const makeIsDefault = async (id: number) => {
        try {
            const response = await apiClient.patch(`/api/account/address/${id}/default`)
            if(response.data.success){
                onIsDefault(response.data.payload)
            }
        } catch (error: any) {
            toast.add({
                type: "error",
                description: "Something wen't wrong!",
                priority: 'high'
            })
        }
    }

    const deleteAddress = async (id: number) => {
        try {
            const response = await apiClient.delete(`/api/account/address/${id}`)
            if(response.data.success){
                fetchAddress()
            }
        } catch (error: any) {
            alert(error.message)
        }
    }

    if (isFetchingData) {
        return (
            <Badge>
                <Spinner data-icon="inline-start" />
                Syncing
            </Badge>
        )
    }

    if (hasError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>
                We couldn't load your addresses. Please try again later.
                </AlertDescription>
            </Alert>
        )
    }

    if(addresses.length <= 0) {
        return <EmptyState />
    }

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                {addresses.map((address) => (
                    <Card key={address.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                { address.label }
                                {
                                    address.isDefault ? <Badge>Default</Badge> : null
                                }
                            </CardTitle>
                            <CardAction>
                                <Badge variant="secondary">
                                    { address.type }
                                </Badge>
                            </CardAction>
                        </CardHeader>

                        <CardContent>
                            <p className="font-medium">
                                { address.recipientName }
                            </p>
                            <p className="text-sm text-muted-foreground">
                                { address.phone }
                            </p>
                            <p className="mt-3 text-sm text-muted-foreground">
                                { address.addressLine1 } { address.addressLine2 ? `, ${address.addressLine2}` : null }
                            </p>
                            <p className="text-sm text-muted-foreground">
                                { `${address.barangay}, ${address.city}, ${address.province} ${address.postalCode}` }
                            </p>
                        </CardContent>

                        <CardFooter className="flex items-center justify-between border-t">
                            <div className="flex flex-wrap items-center gap-2">
                                <Button onClick={() => updateAddress(address.id)} type="button" variant="outline" size="sm">
                                    <Pencil />
                                    Edit
                                </Button>
                                <AddressFormDeleteDialog 
                                    onConfirm={() => deleteAddress(address.id)}
                                />
                            </div>
                            {
                                !address.isDefault ? (
                                    <Field orientation="horizontal" className="inline-flex w-auto">
                                        <Switch
                                            onCheckedChange={(value) => makeIsDefault(address.id)} 
                                            disabled={address.isDefault}
                                            id={`makeDefault-${address.id}`}
                                            size="sm" 
                                        />
                                        <FieldLabel htmlFor={`makeDefault-${address.id}`}>Make this Default</FieldLabel>
                                    </Field>
                                ) : null
                            }
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Edit modal */}
            {
                address && ( 
                    <AddressFormEditDialog 
                        address={address}
                        onModalClose={() => setAddress(null)}
                        onUpdate={(address) => syncUpdatedAddress(address)}
                    />
                )
            }
        </>
    )
}