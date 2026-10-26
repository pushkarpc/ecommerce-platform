import type { GetProductsQueryParams } from '../query-params/get-products-query.types';

export const DEFAULT_SEARCH_FILTERS: GetProductsQueryParams = {
  sortBy: 'createdAt',
  sortOrder: 'DESC',
  page: 1,
  limit: 5,
};
