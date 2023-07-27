export type GetResourcesWithPaginationDTO = {
  page: number
  limit: number
  searchQuery?: string
  filter?: string
}

export type GetResourcesResponse<T> = {
  resources: T[]
  count: number
}
