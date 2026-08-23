
export type Region = {
    regCode: string,
    regionName: string
}

export type Province = {
    regCode: string,
    provCode: string,
    provName: string
}

export type Municipality = {
    provCode: string,
    munCityCode: string,
    munCityName: string
}

export type Barangay = {
    munCityCode: string,
    brgyCode: string,
    brgyName: string
}

export type AddressInformation = {
    label: string,
    type: "SHIPPING" | "BILLING" | null,
    recipientName: string,
    phone: string,
    addressLine1: string,
    addressLine2: string,
    postalCode: string,
    country: "PH",
    isDefault: boolean
}

export type Address = {
    id: number
    label: string
    recipientName: string
    type: string
    phone: string
    addressLine1: string
    addressLine2: string | null
    region: string
    province: string
    city: string
    barangay: string
    country: string
    postalCode: string
    isDefault: boolean
}