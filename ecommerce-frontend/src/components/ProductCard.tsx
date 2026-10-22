import React from 'react';
import type { ProductCardProps } from './product-card-props.types';

export const ProductCard: React.FC<ProductCardProps> = ({ title, description, price, stock, onAddToCart }) => {
  return (
    <div className="border border-slate-200 rounded-lg p-5 shadow-sm bg-white flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{description}</p>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-emerald-600">${price.toFixed(2)}</span>

          {stock > 0 ? (
            <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
              In Stock ({stock})
            </span>
          ) : (
            <span className="text-xs px-2 py-1 bg-rose-50 text-rose-700 rounded-full font-medium">Out of Stock</span>
          )}
        </div>

        <button
          onClick={onAddToCart}
          disabled={stock === 0}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-md transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
