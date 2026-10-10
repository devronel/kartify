import NavBar from "@/components/shared/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Kartify",
    template: "%s | Kartify",
  },
  description: "Shop quality products at Kartify.",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
        <NavBar />
        {children}
    </section>
  )
}