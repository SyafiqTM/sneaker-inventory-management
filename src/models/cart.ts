// API Response Types
export interface SizeInfo {
  size: number;
  stock: number;
  status: string;
}

export interface SneakerApiResponse {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: string;
  color: string;
  image: string;
  sizes: SizeInfo[];
  availableSizes?: number[];
}

// Domain Models (what we actually use in the app)
export interface Size {
  size: number;
  stock: number;
  isAvailable: boolean;
}

// Sneaker model for Cart Page (minimal fields)
export interface Sneaker {
  id: number;
  name: string;
  color: string;
  price: number;
  image: string;
  sizes: Size[];
}

export interface CartItem extends Sneaker {
  size: number;
  quantity: number;
}

// Data Transformation Functions
export const transformSizeInfo = (sizeInfo: SizeInfo): Size => ({
  size: sizeInfo.size,
  stock: sizeInfo.stock,
  isAvailable: sizeInfo.stock > 0 && sizeInfo.status === 'available'
});

// Transform for Cart Page (excludes sku and category)
export const transformSneakerForCart = (apiData: SneakerApiResponse): Sneaker => ({
  id: apiData.id,
  name: apiData.name,
  color: apiData.color,
  price: parseFloat(apiData.price),
  image: apiData.image,
  sizes: apiData.sizes.map(transformSizeInfo)
});

// Batch transform for Cart Page
export const transformSneakersForCart = (apiData: SneakerApiResponse[]): Sneaker[] => {
  return apiData.map(transformSneakerForCart);
};
// Deprecated: kept for backward compatibility
export const transformSneakerFromApi = transformSneakerForCart;
export const transformSneakersFromApi = transformSneakersForCart;
