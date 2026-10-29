import { useDispatch, useSelector } from 'react-redux';
import { useGetProductsQuery } from './api/productApiSlice';
import { LoginComponent } from './components/LoginComponent';
import { ProductCard } from './components/ProductCard';
import { SearchFilters } from './components/SearchFilters';
import { DEFAULT_SEARCH_FILTERS } from './constants/constant-values';
import type { GetProductsQueryParams } from './query-body/get-products-query.types';
import { addToCart, clearCart } from './store/cartSlice';
import { onChangeSearchFilter, onClickNextPage, onClickPreviousPage } from './store/searchFilterSlice';
import type { AppDispatch, RootState } from './store/store';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const searchFilters = useSelector((state: RootState) => state.pagination);
  // Read reactive state directly from the global Redux Store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const totalItemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const { data: products, error, isLoading, isFetching } = useGetProductsQuery(searchFilters);
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading products
        <span role="status" aria-label="Loading">
          <span
            aria-hidden="true"
            className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        </span>
      </div>
    );

  if (error) return <div className="flex items-center justify-center h-screen">Error loading products...</div>;
  if (!products) return <div className="flex items-center justify-center h-screen">Product catalog is empty.</div>;

  function onSearchFiltersChanged(filters: GetProductsQueryParams | undefined, increment: boolean | undefined) {
    if (filters) dispatch(onChangeSearchFilter(filters));
    else if (increment === true) dispatch(onClickNextPage(searchFilters));
    else if (increment === false) dispatch(onClickPreviousPage(searchFilters));
    else dispatch(onChangeSearchFilter(DEFAULT_SEARCH_FILTERS));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Navigation Bar Header Area */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-8 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Product Catalog</h1>
            <p className="text-xs text-slate-500">React + Modern RTK + NestJs + PostgreSQL</p>
          </div>

          {/* Centralized Cart Feedback UI element widget */}
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <span className="text-sm font-medium text-slate-700 cursor-pointer">
              🛒 Items: <strong className="text-slate-900">{totalItemsCount}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-semibold text-emerald-700">Total: ${totalAmount.toFixed(2)}</span>
            {totalItemsCount > 0 && (
              <button
                onClick={() => dispatch(clearCart())}
                className="text-xs ml-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium py-1 px-2 rounded-md transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className=" flex items-center justify-center pt-8">
        <SearchFilters
          currentPage={products.meta.currentPage}
          totalPages={products.meta.totalPages}
          isFetching={isFetching}
          onSearchSubmit={onSearchFiltersChanged}
        />
      </div>

      {/* Main Catalog View Space */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.data.map((product) => {
            const cartItem = cartItems.find((item) => item.id === product.id);
            const availableStock = product.stock - (cartItem?.quantity ?? 0);
            return (
              <ProductCard
                key={product.id} // Unique tracking identifier key required by React
                id={product.id}
                title={product.title}
                description={product.description}
                price={product.price}
                stock={availableStock}
                onAddToCart={() => dispatch(addToCart({ id: product.id, title: product.title, price: product.price }))}
              />
            );
          })}
        </div>
      </div>
      <div>
        <LoginComponent />
      </div>
    </div>
  );
}
