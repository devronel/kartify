export type Paginate<T> = {
    payload: T[],
    currentPage: number,
    hasNext: boolean,
    hasPrevious: boolean,
    pageSize: number,
    totalItems: number,
    totalPages: number
}