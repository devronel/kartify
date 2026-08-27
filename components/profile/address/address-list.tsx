"use client"

import apiClient from "@/lib/api-client"
import { useEffect, useState } from "react"
import { AddressFormCreateDialog } from "./address-form-create-dialog"
import { Address } from "@/types/address"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddressListContent from "./address-list-content"

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
                        <AddressFormCreateDialog 
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
                fetchAddress={getAddressList}
                isFetchingData={isFetchingData}
                hasError={hasError}
            />
        </>
    )
}