"use client"

import apiClient from "@/lib/api-client"
import { useEffect, useState } from "react"
import { AddressCard } from "./AddressCard"
import { AddressFormDialog } from "./AddressFormDialog"
import { Address } from "@/types/address"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AddressList() {

    const [addresses, setAddresses] = useState<Address[]>([])
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
    const [hasError, setHasError] = useState<boolean>(false)

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
                <AddressFormDialog 
                    onCreated={(newAddress) => {
                        setAddresses((prev) => [...prev, newAddress])
                    }}
                />
            </div>

            <AddressListContent 
                addresses={addresses}
                isFetchingData={isFetchingData}
                hasError={hasError}
            />
        </>
    )
}

type AddressListContentProps = {
    addresses: Address[]
    isFetchingData: boolean
    hasError: boolean
}
const AddressListContent = ({ addresses, isFetchingData, hasError }: AddressListContentProps) => {
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
        <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((address) => (
                <AddressCard
                    key={address.id}
                    {...address}
                />
            ))}
        </div>
    )
}