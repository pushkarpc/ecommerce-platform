import type { GetProductsQueryParams } from '../query-params/get-products-query.types';

export interface SearchFilterProps {
  currentPage: number;
  totalPages: number;
  isFetching: boolean;
  onSearchSubmit: (params?: GetProductsQueryParams | undefined, increment?: boolean | undefined) => void;
}
