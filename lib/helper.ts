import { Attribute, VariantCombo } from "@/types/admin/product";
import { PixelCrop } from "react-image-crop";

export const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

export const slugifyFinal = (value: string) => slugify(value).replace(/^-|-$/g, "");

export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`

function cartesian<T>(groups: T[][]): T[][] {
  return groups.reduce<T[][]>(
    (acc, group) =>
      acc.length === 0 ? group.map((item) => [item]) : acc.flatMap((combo) => group.map((item) => [...combo, item])),
    []
  )
}

// --- Build combo for product variant attribute ---
export const buildProductVariantCombos = (selectedAttrs: Attribute[], selectedValueIds: number[]): VariantCombo[] => {
  const valueGroups = selectedAttrs.map((attr) =>
    attr.values.filter((attrValue) => selectedValueIds.includes(attrValue.id))
  )
  return cartesian(valueGroups).map((row) => {
    const ids = row.map((v) => v.id).sort((a, b) => a - b)
    return {
      key: ids.join("-"),
      attrValueIds: ids,
      label: row.map((v) => v.name).join(" / "),
    }
  })
}

// --- Get the first letter of first name and last name ---
export const getInitials = (fullName?: string): string => {
  if (!fullName) return "";

  const parts = fullName.trim().split(" ").filter(Boolean);

  const first = parts[0]?.[0] ?? "A";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "B";

  return (first + last).toUpperCase();
};

// --- Get Crop File ---
export const getCroppedFile = ( image: HTMLImageElement, crop: PixelCrop, fileName: string): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      reject(new Error("No 2d context"))
      return
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = Math.round(crop.width * scaleX)
    canvas.height = Math.round(crop.height * scaleY)

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    )

    // 1. Extract the raw blob data stream
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"))
          return
        }

        // 2. Wrap the Blob directly into a standard native File object
        const finalFile = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        })

        resolve(finalFile)
      },
      "image/jpeg",
      0.9 // Image quality compression profile ratio
    )
  })
}


// --- Generate filename ---
export const generateUniqueFileName = (prefix: string) => {
  const timestamp = Date.now();
  const secureRandom = crypto.randomUUID().split('-')[0];
  
  return `${prefix}-${timestamp}-${secureRandom}.jpg`;
}