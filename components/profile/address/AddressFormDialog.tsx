"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import apiClient from "@/lib/api-client"
import { Address, AddressInformation, Barangay, Municipality, Province, Region } from "@/types/address"
import { loadPsgcData } from "@/lib/load-psgc-data"

type AddressFormDialogProps = {
  open: boolean,
  onClose: () => void,
  onCreated: (newAddress: Address) => void
}

export function AddressFormDialog({ open, onClose, onCreated }: AddressFormDialogProps) {
  
  const [regions, setRegions] = useState<Region[]>([])
  const [provinces, setProvinces] = useState<Province[]>([])
  const [cities, setCities] = useState<Municipality[]>([])
  const [barangays, setBarangays] = useState<Barangay[]>([])
  const [regionCode, setRegionCode] = useState<string>("")
  const [provinceCode, setProvinceCode] = useState<string>("")
  const [cityCode, setCityCode] = useState<string>("")
  const [barangayCode, setBarangayCode] = useState<string>("")
  const [addressInformation, setAddressInformation] = useState<AddressInformation>({
    label: '',
    type: "SHIPPING",
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    country: 'PH',
    isDefault: false
  })
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // --- Get value using onchange event ---
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setAddressInformation(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // --- Get Province base on region code ---
  const getProvince = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {

      const code = event.target.value
      setRegionCode(code)
      setProvinces([])
      setProvinceCode("")
      setCities([])
      setCityCode("")
      setBarangays([])
      setBarangayCode("")

      const { provinces: provincesList } = await loadPsgcData()
      const filteredProvinces = provincesList.filter((province: Province) => province.regCode === code);
      setProvinces(filteredProvinces)

    } catch (error: any) {
      toast.add({
        type: "error",
        description: "Something's wrong, Please try again.",
        priority: "high",
      })
    }
  }

  // -- Get Cities base on province code ---
  const getCity = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const code = event.target.value
      setProvinceCode(code)
      setCities([])
      setCityCode("")
      setBarangays([])
      setBarangayCode("")

      const { cities: citiesList } = await loadPsgcData()
      const filteredCities = citiesList.filter((city: Municipality) => city.provCode === code);
      setCities(filteredCities)

    } catch (error: any) {
      toast.add({
        type: "error",
        description: "Something's wrong, Please try again.",
        priority: "high",
      })
    }
  }

  // --- Get barangay base on city/municipality code ---
  const getBarangay = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const code = event.target.value
      setCityCode(code)
      setBarangays([])
      setBarangayCode("")

      const { barangays: barangaysList } = await loadPsgcData()
      const filteredBarangays = barangaysList.filter((barangay: Barangay) => barangay.munCityCode === code);
      setBarangays(filteredBarangays)

    } catch (error: any) {
      toast.add({
        type: "error",
        description: "Something's wrong, Please try again.",
        priority: "high",
      })
    }
  }

  // -- Get All Region ---
  const getRegion = async () => {
    try {
      const { regions: regionsList } = await loadPsgcData()
      setRegions(regionsList)
    } catch (error: any) {
      toast.add({
        type: "error",
        description: "Something's wrong, Please try again.",
        priority: "high",
      })
    }
  }

  // --- Close modal ---
  const close = () => {
    onClose()
    setErrors({})
  }

  const regionMap = useMemo(() => Object.fromEntries(regions.map(region => [region.regCode, region.regionName])), [regions]);
  const provinceMap = useMemo(() => Object.fromEntries(provinces.map(province => [province.provCode, province.provName])), [provinces]);
  const cityMap = useMemo(() => Object.fromEntries(cities.map(city => [city.munCityCode, city.munCityName])), [cities]);
  const barangayMap = useMemo(() => Object.fromEntries(barangays.map(barangay => [barangay.brgyCode, barangay.brgyName])), [barangays]);

  // --- Save data to database ---
  const save = async () => {
    try {
      
      const address = {
        ...addressInformation,
        addressLine2: addressInformation.addressLine2 === '' ? null : addressInformation.addressLine2,
        region: regionMap[regionCode],
        province: provinceMap[provinceCode],
        city: cityMap[cityCode],
        barangay: barangayMap[barangayCode]
      }

      setIsButtonLoading(true)
      const response = await apiClient.post('/api/account/address', address, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if(response.data.success){
        
        onCreated(response.data.payload)

        // --- Reset the state ---
        setIsButtonLoading(false)
        onClose()
        setErrors({})
        setRegionCode('')
        setProvinceCode('')
        setCityCode('')
        setBarangayCode('')
        setRegions([])
        setProvinces([]);
        setCities([])
        setBarangays([])
        setAddressInformation({
          label: '',
          type: "SHIPPING",
          recipientName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          postalCode: '',
          country: 'PH',
          isDefault: false
        })
      }
      
    } catch (error: any) {
      setIsButtonLoading(false)
      switch (error.status) {
        case 422:
          setErrors(error.response.data.errors)
          break;
        default:
          console.log(error.response)
          break;
      }
    }
  }

  useEffect(() => {
    getRegion();
  }, [])

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Address</DialogTitle>
          <DialogDescription>
            Add your new address.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="addressLabel">Label</FieldLabel>
            <Input
              id="addressLabel"
              name="label"
              type="text"
              placeholder="Home, Office and etc."
              aria-invalid={errors.label ? true : false}
              value={addressInformation.label}
              onChange={handleOnChange}
            />
            { errors.label && (<FieldError>{errors.label}</FieldError>) }
          </Field>

          <Field>
            <FieldLabel htmlFor="addressType">Type</FieldLabel>
            <Select name="type" onValueChange={value => setAddressInformation(prev => ({ ...prev, type: value }))} value={addressInformation.type}>
              <SelectTrigger id="addressType" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHIPPING">Shipping</SelectItem>
                <SelectItem value="BILLING">Billing</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="recipientName">Recipient Name</FieldLabel>
            <Input
              id="recipientName"
              name="recipientName"
              type="text"
              aria-invalid={errors.recipientName ? true : false}
              value={addressInformation.recipientName}
              onChange={handleOnChange}
            />
            { errors.recipientName && (<FieldError>{errors.recipientName}</FieldError>) }
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input 
              id="phone" 
              name="phone" 
              type="tel" 
              aria-invalid={errors.phone ? true : false}
              value={addressInformation.phone}
              onChange={handleOnChange}
            />
            { errors.phone && (<FieldError>{errors.phone}</FieldError>) }
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="addressLine1">Address Line 1</FieldLabel>
            <Input
              id="addressLine1"
              name="addressLine1"
              type="text"
              aria-invalid={errors.addressLine1 ? true : false}
              value={addressInformation.addressLine1}
              onChange={handleOnChange}
            />
            { errors.addressLine1 && (<FieldError>{errors.addressLine1}</FieldError>) }
          </Field>

          <Field>
            <FieldLabel htmlFor="addressLine2">Address Line 2 (optional)</FieldLabel>
            <Input
              id="addressLine2"
              name="addressLine2"
              type="text"
              value={addressInformation.addressLine2}
              onChange={handleOnChange}
            />
          </Field>

          {/* --- Region Select --- */}
          <Field>
            <FieldLabel htmlFor="region">Region</FieldLabel>
            <select
                id="region"
                value={regionCode}
                onChange={getProvince}
                className={`w-45 rounded-md border px-3 py-2 ${errors.region ? 'border-destructive' : ''}`}
              >
                <option value="">Select region</option>

                {regions.map((region) => (
                  <option
                    key={region.regCode}
                    value={region.regCode}
                  >
                    {region.regionName}
                  </option>
                ))}
              </select>
              { errors.region && (<FieldError>{errors.region}</FieldError>) }
          </Field>

          {/* --- Province Select ---  */}
          <Field>
            <FieldLabel htmlFor="addressLine2">Province</FieldLabel>
            <select
                value={provinceCode}
                onChange={getCity}
                className={`w-45 rounded-md border px-3 py-2 ${errors.province ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              >
                <option value="">Select Province</option>

                {provinces.map((province) => (
                  <option
                    key={province.provCode}
                    value={province.provCode}
                  >
                    {province.provName}
                  </option>
                ))}
              </select>
              { errors.province && (<FieldError>{errors.province}</FieldError>) }
          </Field>

          {/* --- City/Municipality Select --- */}
          <Field>
            <FieldLabel htmlFor="addressLine2">City/Municipality</FieldLabel>
            <select
                value={cityCode}
                onChange={getBarangay}
                className={`w-45 rounded-md border px-3 py-2 ${errors.city ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              >
                <option value="">Select City/Municipality</option>

                {cities.map((city) => (
                  <option
                      key={city.munCityCode}
                      value={city.munCityCode}
                    >
                    {city.munCityName}
                  </option>
                ))}
              </select>
              { errors.city && (<FieldError>{errors.city}</FieldError>) }
          </Field>

          {/* --- Barangay Select --- */}
          <Field>
            <FieldLabel htmlFor="addressLine2">Barangay</FieldLabel>
            <select
                value={barangayCode}
                onChange={(e) => setBarangayCode(e.target.value)}
                className={`w-45 rounded-md border px-3 py-2 ${errors.barangay ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              >
                <option value="">Select Barangay</option>

                {barangays.map((barangay) => (
                  <option
                      key={barangay.brgyCode}
                      value={barangay.brgyCode}
                    >
                    {barangay.brgyName}
                  </option>
                ))}
              </select>
              { errors.barangay && (<FieldError>{errors.barangay}</FieldError>) }
          </Field>

          <Field>
            <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
            <Input 
              id="postalCode" 
              name="postalCode" 
              type="text" 
              aria-invalid={errors.postalCode ? true : false}
              value={addressInformation.postalCode} 
              onChange={handleOnChange}
            />
            { errors.postalCode && (<FieldError>{errors.postalCode}</FieldError>) }
          </Field>
        </div>

        <DialogFooter>
          <Button onClick={close} type="button" disabled={isButtonLoading} variant="outline">
            Cancel
          </Button>
          <Button onClick={save} disabled={isButtonLoading} type="button">
            Save
            {
              isButtonLoading ? <Spinner data-icon="inline-start" /> : '' 
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
