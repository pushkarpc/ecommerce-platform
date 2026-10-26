import { createSlice } from '@reduxjs/toolkit';
import type { GetProductsResponse } from '../components/product.types';

const initialState: GetProductsResponse = {
  data: [],
  meta: { totalItems: 0, itemCount: 0, itemsPerPage: 0, totalPages: 0, currentPage: 0 },
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // updateProductsList(state, action: PayloadAction<GetProductsQueryParams>) {
    //   const { data: products, error, isLoading } = useGetProductsQuery(action.payload);
    //   if (products) {
    //     state.data = products?.data;
    //     state.meta = products?.meta;
    //   }
    // },
    // saveProductsList(_state, action) {
    //   return action.payload;
    // },
  },
});

// export const { updateProductsList, saveProductsList } = productSlice.actions;
export default productSlice.reducer;
