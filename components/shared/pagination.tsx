"use client"

import { generatePagination } from "@/lib/helper";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

type CustomPaginationProps = {
    currentPage: number,
    totalPages: number,
    visiblePages: number,
    hasPrevious?: boolean,
    hasNext?: boolean
}

export default function CustomPagination({ currentPage, totalPages, visiblePages, hasPrevious, hasNext }: CustomPaginationProps ){
    
    const pages = generatePagination(currentPage, totalPages, visiblePages);
    
    return (
        <Pagination>
            <PaginationContent>

                <PaginationItem>
                    <PaginationPrevious 
                        href={`${hasPrevious ? `products?page=${currentPage - 1}` : ''}`}  
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
                                    href={`products${page !== 1 ? `?page=${page}` : ''}`} 
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
                        href={`${hasNext ? `products?page=${currentPage + 1}` : ''}`}  
                        isDisabled={!hasNext} 
                        className={`${!hasNext ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    )
}