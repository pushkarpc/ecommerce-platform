export interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  stock: number;
  onAddToCart: () => void; // An event emitter function callback
}
