import apiPsgcClient from "./api-psgc"
import { Barangay, Municipality, Province, Region } from "@/types/address"

type PsgcData = {
  regions: Region[],
  provinces: Province[],
  cities: Municipality[],
  barangays: Barangay[]
}

let psgcPromise: Promise<PsgcData> | null = null

export const loadPsgcData = (): Promise<PsgcData> => {
  if (!psgcPromise) {
    psgcPromise = Promise.all([
      apiPsgcClient('/psgc/regions.json'),
      apiPsgcClient('/psgc/provinces.json'),
      apiPsgcClient('/psgc/cities.json'),
      apiPsgcClient('/psgc/barangays.json'),
    ]).then(([regions, provinces, cities, barangays]) => {
      for (const res of [regions, provinces, cities, barangays]) {
        if (res.status !== 200) throw new Error('PSGC data failed to load')
      }
      return {
        regions: regions.data,
        provinces: provinces.data,
        cities: cities.data,
        barangays: barangays.data,
      }
    })
  }
  return psgcPromise
}