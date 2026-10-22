import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartState } from './cart.types';

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Action 1: Add a product to our centralized shopping cart state array
    addToCart: (state, action: PayloadAction<{ id: number; title: string; price: number }>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        // Redux Toolkit uses a library called 'Immer' under the hood.
        // This lets you safely write natural direct mutations while converting
        // them into immutable copy updates behind the scenes!
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: action.payload.id,
          title: action.payload.title,
          price: action.payload.price,
          quantity: 1,
        });
      }
      // Keep track of the total checkout billing price across items
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    // Action 2: Remove or decrement an item count entirely
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    // Action 3: Clear the entire workspace on checkout success
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

// Export the generated actions to be dispatched by our UI button triggers
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

// Export the reducer to hook it into our central store engine configuration
export default cartSlice.reducer;
