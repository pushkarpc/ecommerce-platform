import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartReducer, // Registering functional cart state globally
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

// Reusable TypeScript type signatures for reading data and dispatching actions safely
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
