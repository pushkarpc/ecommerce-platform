import type { GetProductsResponse, Product } from '../components/product.types';
import { apiSlice } from './apiSlice';

type ApiProduct = Omit<Product, 'price'> & { price: number | string };
type ApiGetProductsResponse = Omit<GetProductsResponse, 'data'> & { data: ApiProduct[] };

const normalizeProduct = ({ price, ...product }: ApiProduct): Product => ({
  ...product,
  price: Number(price),
});

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResponse, void>({
      query: () => '/products', // Matches NestJS @Get('products') path
      transformResponse: (response: ApiGetProductsResponse): GetProductsResponse => ({
        ...response,
        data: response.data.map(normalizeProduct),
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`, // Matches NestJS @Get('products/:id') path
      transformResponse: (response: ApiProduct): Product => normalizeProduct(response),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApiSlice;
