import NavBar from "@/components/shared/navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
        <NavBar />
        {children}
    </section>
  )
}