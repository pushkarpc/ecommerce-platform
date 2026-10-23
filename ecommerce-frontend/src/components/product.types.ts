export interface ProductCardProps extends Product {
  onAddToCart: () => void; // An event emitter function callback
}

export interface GetProductsResponse {
  data: Product[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
export interface Product {
  id: number;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}
