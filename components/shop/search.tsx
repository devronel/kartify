import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchProduct() {
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState<string>("")
  
  const submit = (event: React.SubmitEvent) => {
    event.preventDefault()

    const params = new URLSearchParams();

    const currentSearch = searchParams.get("q") ?? "";
    const newSearch = search.trim();

    if(searchParams.get("category")){
      params.set("category", searchParams.get("category") ?? "");
    }

    if (!newSearch) {

      if (!currentSearch) return;

      router.push(`/shop?${params}`);
      
      return;
    
    }

    if (currentSearch === newSearch) return;
    
    params.set("q", newSearch);

    router.push(`/shop?${params}`);

  }

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "")
  }, [searchParams])

  return (
    <div className="hidden md:block flex-1 max-w-xl">
      <form onSubmit={submit}>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          <InputGroupInput onChange={(event) => setSearch(event.target.value)} value={search} placeholder="Search products, and more..." />
          <InputGroupAddon align="inline-end">
            <InputGroupButton type="submit" variant="secondary" className="cursor-pointer">Search</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
  
}