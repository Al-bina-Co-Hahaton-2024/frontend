export interface IDocsData {
    content: IDoctor[]
    pageable: IPageable
    totalPages: number
    totalElements: number
    last: boolean
    size: number
    number: number
    sort: ISort
    numberOfElements: number
    first: boolean
    empty: boolean
}

export interface IDoctor {
    id: string
    rate: number
    modality: string
    optionalModality: any
}

export interface IPageable {
    pageNumber: number
    pageSize: number
    sort: ISort
    offset: number
    paged: boolean
    unpaged: boolean
}

export interface ISort {
    empty: boolean
    unsorted: boolean
    sorted: boolean
}
