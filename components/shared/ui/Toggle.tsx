import { Switch } from "@base-ui/react"

type ToggleType = {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    size?: "sm" | "md"
}

export default function Toggle({
  checked,
  onCheckedChange,
  size = "md",
}: ToggleType ) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={`group inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring ${
        size === "sm" ? "h-5 w-9" : "h-6 w-11"
      } ${checked ? "bg-primary" : "bg-sidebar-accent"} disabled:opacity-50`}
    >
      <Switch.Thumb
        className={`block rounded-full bg-white shadow-md transition-transform group-data-checked:translate-x-full group-data-unchecked:translate-x-0 ${
          size === "sm" ? "size-4" : "size-5"
        }`}
      />
    </Switch.Root>
  )
}