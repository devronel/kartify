import NavBar from "@/components/shared/NavBar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
        <NavBar />
        {children}
    </section>
  )
}