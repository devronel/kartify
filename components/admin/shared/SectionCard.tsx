export default function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-sidebar-border bg-sidebar">
      <header className="flex items-start justify-between gap-4 border-b border-sidebar-border p-5">
        <div>
          <h2 className="text-base font-semibold text-sidebar-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-sidebar-foreground/60">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}