export interface Store {
  id: string;
  name: string;
  address: string;
  productCount?: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
}
