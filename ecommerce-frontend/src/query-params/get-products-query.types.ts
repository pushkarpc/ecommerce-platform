export interface GetProductsQueryParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}
