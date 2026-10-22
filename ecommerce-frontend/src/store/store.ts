import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer, // Registering our functional cart state globally
  },
});

// Reusable TypeScript type signatures for reading data and dispatching actions safely
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
