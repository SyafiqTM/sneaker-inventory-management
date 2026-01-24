import { Size, SizeInfo, SneakerApiResponse, transformSizeInfo } from './cart';

// Sneaker model for Inventory List (includes sku and category)
export interface InventorySneaker {
    id: number;
    name: string;
    sku: string;
    category: string;
    color: string;
    price: number;
    image: string;
    sizes: Size[];
}

// Transform for Inventory List (includes sku and category)
export const transformSneakerForInventory = ( apiData: SneakerApiResponse, ): InventorySneaker => ({
    id: apiData.id,
    name: apiData.name,
    sku: apiData.sku,
    category: apiData.category,
    color: apiData.color,
    price: parseFloat(apiData.price),
    image: apiData.image,
    sizes: apiData.sizes.map(transformSizeInfo),
});

// Batch transform for Inventory List
export const transformSneakersForInventory = ( apiData: SneakerApiResponse[], ): InventorySneaker[] => {
    return apiData.map(transformSneakerForInventory);
};
