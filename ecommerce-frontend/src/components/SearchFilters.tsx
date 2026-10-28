import { useDispatch } from 'react-redux';
import type { GetProductsQueryParams } from '../query-body/get-products-query.types';
import { onChangeOrder, onChangeSorting } from '../store/searchFilterSlice';
import type { SearchFilterProps } from './search.types';

export const SearchFilters: React.FC<SearchFilterProps> = ({ currentPage, totalPages, isFetching, onSearchSubmit }) => {
  const dispatch = useDispatch();
  return (
    <form
      onReset={() => onSearchSubmit()}
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newSearchFilters: GetProductsQueryParams = {
          search: String(formData.get('productSearch')) === '' ? undefined : String(formData.get('productSearch')),
          minPrice: Number(formData.get('minPrice')) === 0 ? undefined : Number(formData.get('minPrice')),
          maxPrice: Number(formData.get('maxPrice')) === 0 ? undefined : Number(formData.get('maxPrice')),
          sortBy: String(formData.get('sortBy')) ?? 'createdAt',
          sortOrder: String(formData.get('orderBy')) ?? 'DESC',
          page: currentPage,
        };
        onSearchSubmit(newSearchFilters);
      }}
    >
      <search>
        <input
          type="search"
          name="productSearch"
          placeholder="Search products..."
          aria-label="Search products"
          className="w-md rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="rounded-md p-2 border ml-3 bg-slate-900 transition hover:bg-slate-800 text-white font-medium"
        >
          Search
        </button>
        <button
          type="reset"
          className="rounded-md p-2 border ml-3 bg-slate-900 transition hover:bg-slate-800 text-white font-medium"
        >
          Reset
        </button>

        <button
          disabled={currentPage === 1 || isFetching}
          className="ml-3 px-2 border ml-3 pb-1 bg-slate-500 transition hover:bg-slate-800 text-white font-medium disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          type="button"
          name="previousPage"
          onClick={() => {
            onSearchSubmit(undefined, false);
          }}
        >
          {'<'}
        </button>
        <button
          disabled={currentPage === totalPages || isFetching}
          className="place-content-end ml-3 px-2 pb-1 border ml-3 bg-slate-500 transition hover:bg-slate-800 text-white font-medium disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          type="button"
          name="nextPage"
          onClick={() => {
            onSearchSubmit(undefined, true);
          }}
        >
          {'>'}
        </button>

        <div>
          <label htmlFor="min-price">Min. price</label>
          <input
            className="ml-3 mt-3 w-17 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            name="minPrice"
            id="min-price"
          />

          <label className="ml-3 mt-3" htmlFor="max-price">
            Max. price
          </label>
          <input
            className="ml-3 mt-3 w-17 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            name="maxPrice"
            id="max-price"
          />

          <select
            defaultValue="createdAt"
            className="ml-3 mt-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="sortBy"
            onChange={(event) => dispatch(onChangeSorting(event.target.value))}
          >
            <option value="createdAt">Sort by</option>
            <option value="price">Price</option>
            <option value="createdAt">Creation date</option>
            <option value="title">Title</option>
          </select>

          <select
            defaultValue="DESC"
            className="ml-3 mt-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="orderBy"
            onChange={(event) => dispatch(onChangeOrder(event.target.value))}
          >
            <option value="DESC">Order by</option>
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </search>
    </form>
  );
};
