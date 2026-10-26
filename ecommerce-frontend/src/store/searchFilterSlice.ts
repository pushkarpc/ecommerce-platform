import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_SEARCH_FILTERS } from '../constants/constant-values';
import type { GetProductsQueryParams } from '../query-params/get-products-query.types';

const initialState: GetProductsQueryParams = DEFAULT_SEARCH_FILTERS;

export const searchFilterSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    onChangeSearchFilter(_state, action: PayloadAction<GetProductsQueryParams>) {
      return action.payload;
    },

    onChangeSorting(state, action: PayloadAction<string>) {
      state.sortBy = action.payload;
    },
    onChangeOrder(state, action: PayloadAction<string>) {
      state.sortOrder = action.payload;
    },

    onClickNextPage(state, action) {
      state.page = action.payload.page + 1;
    },
    onClickPreviousPage(state, action) {
      state.page = action.payload.page - 1;
    },
  },
});
export const { onChangeSearchFilter, onClickNextPage, onClickPreviousPage, onChangeSorting, onChangeOrder } =
  searchFilterSlice.actions;
export default searchFilterSlice.reducer;
