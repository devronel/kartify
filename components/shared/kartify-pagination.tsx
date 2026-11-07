"use client"

import { generatePagination } from "@/lib/helper";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { useSearchParams } from "next/navigation";

type CustomPaginationProps = {
    currentPage: number,
    totalPages: number,
    visiblePages: number,
    hasPrevious?: boolean,
    hasNext?: boolean
}

export default function KartifyPagination({ 
    currentPage, 
    totalPages, 
    visiblePages, 
    hasPrevious, 
    hasNext
}: CustomPaginationProps ){
    
  const queryParameters = useSearchParams()
  const pages = generatePagination(currentPage, totalPages, visiblePages);

  const changePage = (page: number) => {

    const params = new URLSearchParams(queryParameters.toString());

    if(page <= 1){
        params.delete("page")
    } else {
        params.set("page", String(page));
    }

    return `?${params.toString()}`;

  };

  const previousAndNext = (type: "previous" | "next") => {
      
      const params = new URLSearchParams(queryParameters.toString());
      
      let currentParams = null;

      if(type === "previous"){
          currentParams = Number(params.get("page")) - 1
      }else {
          const activePage = Number(params.get("page"));
          currentParams = activePage <= 0 ? activePage + 2 : activePage + 1
      }
      
      if(currentParams <= 1) {
          params.delete("page")
      }else{
          params.set("page", String(currentParams));
      }
      
      return `?${params.toString()}`;

  }
  
  return (
      <Pagination>
          <PaginationContent>

              <PaginationItem>
                  <PaginationPrevious
                      href={previousAndNext("previous")}
                      isDisabled={!hasPrevious} 
                      className={`${!hasPrevious ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  />
              </PaginationItem>

              {
                  pages.map((page, index) => {
                      if(typeof page === "string"){
                          return (
                              <PaginationItem key={index}>
                                  <PaginationEllipsis />
                              </PaginationItem>
                          )
                      }

                      return (
                          <PaginationItem key={index}>
                              <PaginationLink
                                  href={changePage(page)}
                                  isActive={page === currentPage}
                                  isDisabled={page === currentPage} 
                                  className={`${page === currentPage ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                  {page}
                              </PaginationLink>
                          </PaginationItem>
                      )
                  })
              }

              <PaginationItem>
                  <PaginationNext
                      href={previousAndNext("next")}
                      isDisabled={!hasNext} 
                      className={`${!hasNext ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  />
              </PaginationItem>

          </PaginationContent>
      </Pagination>
  )
}