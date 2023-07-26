export type GetResourcesWithPaginationDTO = {
  page: number
  limit: number
  searchQuery?: string
  filter?: string
  userID?: number
}

export type GetResourcesResponse<T> = {
  resources: T[]
  count: number
}
