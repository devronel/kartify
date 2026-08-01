import { Attribute, VariantCombo } from "@/types/admin/product";

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