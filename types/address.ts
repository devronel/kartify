
export type Region = {
    regCode: string,
    regionName: string
}

export type Province = {
    provCode: string,
    provName: string
}

export type Municipality = {
    munCityCode: string,
    munCityName: string
}

export type Barangay = {
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