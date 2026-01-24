import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1.0/inventory/";
const API_SNEAKERS_URL = "http://localhost:8000/api/v1.0/sneakers/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const apiClientSneakers = axios.create({
  baseURL: API_SNEAKERS_URL,
  timeout: 10000,
});

// Session management
export const createSession = async (userName) => {
  try {
    const response = await apiClient.post("/session", { userName });
    return response.data; // Expected: { sessionId, userName }
  } catch (error) {
    console.log("Error creating session:", error);
    throw error;
  }
};

export const validateSession = async (sessionId) => {
  try {
    const response = await apiClient.get(`/session/${sessionId}`);
    return response.data; // Expected: { sessionId, userName, isValid }
  } catch (error) {
    console.log("Error validating session:", error);
    throw error;
  }
};

export const getAllItems = async () => {
  try {
    const response = await apiClient.get("/items");
    return response.data;
  } catch (error) {
    console.log("Error fetching items:", error);
    throw error;
  }
};

export const getItemById = async (itemId) => {
  try {
    const response = await apiClient.get(`/items/${itemId}`);
    return response.data;
  } catch (error) {
    //generic error for items not found
    console.log(`Error getting item details:`, error);
    throw error;
  }
};

export const createNewItem = async (itemData) => {
    try {
        const response = await apiClient.post("/items", itemData);
        return response.data;
    } catch (error) {
        console.log("Error creating item:", error);
        throw error;
    }
};

export const updateItem = async (itemId, itemData) => {
    try {
        const response = await apiClient.put(`/items/${itemId}`, itemData);
        return response.data;
    } catch (error) {
        console.log("Error updating item:", error);
        throw error;
    }   
};

export const deleteItem = async (itemId) => {
    try {
        const response = await apiClient.delete(`/items/${itemId}`);
        return response.data;
    }   catch (error) {
        console.log("Error deleting item:", error);
        throw error;
    }
};

export const searchItems = async (query) => {
    try {
        const response = await apiClient.get(`/items/search`, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.log("Error searching items:", error);
        throw error;
    }
};

// Sneakers API
export const getAllSneakers = async () => {
    try {
        const response = await apiClientSneakers.get(`items`);
        return response.data?.data || []; // API wraps array in data property
    } catch (error) {
        console.log("Error fetching sneakers:", error);
        throw error;
    }
};

export default apiClient;