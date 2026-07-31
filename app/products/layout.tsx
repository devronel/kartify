import NavBar from "@/components/shared/NavBar";

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
        <NavBar />
        {children}
    </section>
  )
}