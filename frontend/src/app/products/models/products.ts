


export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  brand: string;
  oldPrice: number;
  newPrice: number;
  timing: number;
  isFeatured: boolean;
  category: {
    _id: string; // Ensure category has _id property
    name: string;
    icon: string;
    color: string;
  };
  dateCreated: string;
  tot_quantity: number;
}

