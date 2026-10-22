import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from './components/ProductCard';
import { mockProducts } from './mock-products';
import { addToCart, clearCart } from './store/cartSlice';
import type { AppDispatch, RootState } from './store/store';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  // Read reactive state directly from the global Redux Store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  // Calculate total number of items in the cart array
  const totalItemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const [products, setProducts] = useState(mockProducts);

  const handlePurchaseClick = (productId: number, title: string, price: number) => {
    dispatch(addToCart({ id: productId, title, price }));

    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id === productId && product.stock > 0) {
          return { ...product, stock: product.stock - 1 };
        }
        return product;
      }),
    );
  };

  const handleClearCartAndResetStock = () => {
    dispatch(clearCart());

    setProducts(mockProducts);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Navigation Bar Header Area */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-8 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">CacheStore Front</h1>
            <p className="text-xs text-slate-500">React + Modern RTK State Mesh</p>
          </div>

          {/* Centralized Cart Feedback UI element widget */}
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <span className="text-sm font-medium text-slate-700">
              🛒 Items: <strong className="text-slate-900">{totalItemsCount}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-semibold text-emerald-700">Total: ${totalAmount.toFixed(2)}</span>
            {totalItemsCount > 0 && (
              <button
                onClick={() => handleClearCartAndResetStock()}
                className="text-xs ml-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium py-1 px-2 rounded-md transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Catalog View Space */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id} // Unique tracking identifier key required by React
              title={product.title}
              description={product.description}
              price={product.price}
              stock={product.stock}
              onAddToCart={() => handlePurchaseClick(product.id, product.title, product.price)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
