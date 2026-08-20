"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import apiPsgcClient from "@/lib/api-psgc"
import { useEffect, useMemo, useState } from "react"
import { Barangay, Municipality, Province, Region } from "@/types/address"

export function AddressFormDialog() {
  
  const [regions, setRegions] = useState<Region[]>([])
  const [provinces, setProvinces] = useState<Province[]>([])
  const [cities, setCities] = useState<Municipality[]>([])
  const [barangays, setBarangays] = useState<Barangay[]>([])
  const [regionCode, setRegionCode] = useState<string>("")
  const [provinceCode, setProvinceCode] = useState<string>("")
  const [cityCode, setCityCode] = useState<string>("")
  const [barangayCode, setBarangayCode] = useState<string>("")

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

      const response = await apiPsgcClient('/psgc/provinces.json')
      if(response.status === 200){
        const filteredProvinces = response.data.filter((province: { regCode: string }) => province.regCode === code);
        setProvinces(filteredProvinces)
      }
    } catch (error: any) {
      console.log(error.message)
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

      const response = await apiPsgcClient('/psgc/cities.json')
      if(response.status === 200){
        const filteredCities = response.data.filter((city: { provCode: string }) => city.provCode === code);
        setCities(filteredCities)
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  // --- Get barangay base on city/municipality code ---
  const getBarangay = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const code = event.target.value
      setCityCode(code)
      setBarangays([])
      setBarangayCode("")

      const response = await apiPsgcClient('/psgc/barangays.json')
      if(response.status === 200){
        const filteredBarangays = response.data.filter((barangay: { munCityCode: string }) => barangay.munCityCode === code);
        setBarangays(filteredBarangays)
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  // -- Get All Region ---
  const getRegion = async () => {
    try {
      const response = await apiPsgcClient('/psgc/regions.json')
      console.log(response)
      setRegions(response.data)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const regionMap = useMemo(() => Object.fromEntries(regions.map(region => [region.regCode, region.regionName])), [regions]);
  const provinceMap = useMemo(() => Object.fromEntries(provinces.map(province => [province.provCode, province.provName])), [provinces]);
  const cityMap = useMemo(() => Object.fromEntries(cities.map(city => [city.munCityCode, city.munCityName])), [cities]);
  const barangayMap = useMemo(() => Object.fromEntries(barangays.map(barangay => [barangay.brgyCode, barangay.brgyName])), [barangays]);

  const save = () => {
    console.log(`${regionMap[regionCode]} --> ${provinceMap[provinceCode]} --> ${cityMap[cityCode]} --> ${barangayMap[barangayCode]}`)
  }

  useEffect(() => {
    getRegion();
  }, [])

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

          {/* --- Region Select --- */}
          <Field>
            <FieldLabel htmlFor="addressLine2">Region</FieldLabel>
            <select
                value={regionCode}
                onChange={getProvince}
                className="w-45 rounded-md border px-3 py-2"
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
          </Field>

          {/* --- Province Select ---  */}
          <Field>
            <FieldLabel htmlFor="addressLine2">Province</FieldLabel>
            <select
                value={provinceCode}
                onChange={getCity}
                className="w-45 rounded-md border px-3 py-2"
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
          </Field>

          {/* --- City/Municipality Select --- */}
          <Field>
            <FieldLabel htmlFor="addressLine2">City/Municipality</FieldLabel>
            <select
                value={cityCode}
                onChange={getBarangay}
                className="w-45 rounded-md border px-3 py-2"
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
          </Field>

          {/* --- Barangay Select --- */}
          <Field>
            <FieldLabel htmlFor="addressLine2">Barangay</FieldLabel>
            <select
                value={barangayCode}
                onChange={(e) => setBarangayCode(e.target.value)}
                className="w-45 rounded-md border px-3 py-2"
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
          <Button onClick={save} type="button">Save Address</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
