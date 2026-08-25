"use client"

import apiClient from "@/lib/api-client"
import { useEffect, useState } from "react"
import { AddressFormDialog } from "./AddressFormDialog"
import { Address } from "@/types/address"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Pencil, Plus, Trash2 } from "lucide-react"
import { AddressFormEditDialog } from "./AddressFormEditDialog"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export function AddressList() {

    const [addresses, setAddresses] = useState<Address[]>([])
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
    const [hasError, setHasError] = useState<boolean>(false)
    const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false)

    // --- Get List of user address ---
    const getAddressList = async () => {
        try {
            setIsFetchingData(true)
            const response = await apiClient('/api/account/address')
            if(response.data.success){
                setAddresses(response.data.payload)

                setIsFetchingData(false)
                setHasError(false)
            }
        } catch (error) {
            setIsFetchingData(false)
            setHasError(true)
        }
    }

    // --- Sync the updated address to the UI ---
    const syncUpdatedAddress = (address: Address) => {
        setAddresses(prevAddresses => 
            prevAddresses.map(prevAddress => 
                prevAddress.id === address.id ? address : prevAddress
            )
        );
    }

    // --- Update the default address in the array object ---
    const onIsDefault = (address: Address) => {
        setAddresses((prev) =>
            prev.map((item) => ({
                ...item,
                isDefault: item.id === address.id,
            }))
        );
    }

    // --- Add the newly created address in the addresses list ---
    const addCreatedAddress = (newAddress: Address) => {
        setAddresses((prev) => [
            ...prev.map((address) => ({
                ...address,
                isDefault: newAddress.isDefault ? false : address.isDefault,
            })),
            newAddress,
        ]);
    }

    useEffect(() => {
        getAddressList()
    }, [])

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">My Addresses</h1>
                    <p className="text-sm text-muted-foreground">
                    Manage the addresses you use for shipping and billing.
                    </p>
                </div>
                <Button onClick={() => setIsOpenCreateModal(true)}>
                    <Plus /> Add New Address
                </Button>
                {
                    isOpenCreateModal && (
                        <AddressFormDialog 
                            open={isOpenCreateModal}
                            onClose={() => setIsOpenCreateModal(false)}
                            onCreated={(newAddress) => addCreatedAddress(newAddress)}
                        />
                    )
                }
            </div>

            <AddressListContent 
                addresses={addresses}
                syncUpdatedAddress={(address: Address) => syncUpdatedAddress(address)}
                onIsDefault={(address: Address) => onIsDefault(address)}
                isFetchingData={isFetchingData}
                hasError={hasError}
            />
        </>
    )
}


// --- Address List Content Component ---

type AddressListContentProps = {
    addresses: Address[],
    syncUpdatedAddress: (address: Address) => void,
    onIsDefault: (address: Address) => void,
    isFetchingData: boolean
    hasError: boolean
}
const AddressListContent = ({ addresses, syncUpdatedAddress, onIsDefault, isFetchingData, hasError }: AddressListContentProps) => {

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
    const makeIsDefault = async (id: number, isDefault: boolean) => {
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
                                <Button type="button" variant="destructive" size="sm">
                                    <Trash2 />
                                    Delete
                                </Button>
                            </div>
                            {
                                !address.isDefault ? (
                                    <Field orientation="horizontal" className="inline-flex w-auto">
                                        <Switch
                                            onCheckedChange={(value) => makeIsDefault(address.id, value)} 
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