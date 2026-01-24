import axios from "axios";

const ROOT_URL = import.meta.env.VITE_ROOT_URL || "http://localhost:8000/api/v1.0/";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1.0/inventory/";
const API_SNEAKERS_URL = import.meta.env.VITE_API_SNEAKERS_URL || "http://localhost:8000/api/v1.0/sneakers/";

const apiSession = axios.create({
  baseURL: ROOT_URL,
  timeout: 10000,
});

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const apiClientSneakers = axios.create({
  baseURL: API_SNEAKERS_URL,
  timeout: 10000,
});

// Add request interceptor to include X-Session-Id header for POST, PUT, DELETE
const addSessionInterceptor = (client) => {
  client.interceptors.request.use(
    (config) => {
      // Only add header for POST, PUT, DELETE requests
      if (['post', 'put', 'delete'].includes(config.method?.toLowerCase())) {
        const sessionId = localStorage.getItem('inventory_session_id');
        if (sessionId) {
          config.headers['X-Session-Id'] = sessionId;
        } else {
          // If sessionId doesn't exist, trigger login modal by clearing auth state
          window.dispatchEvent(new CustomEvent('auth-required'));
          return Promise.reject({
            message: "Authentication required",
            isAuthError: true
          });
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle 401 Unauthorized
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.dispatchEvent(new CustomEvent('auth-required'));
      }
      return Promise.reject(error);
    }
  );
};

// Apply interceptor to both clients
addSessionInterceptor(apiClient);
addSessionInterceptor(apiClientSneakers);

// Session management
export const createSession = async (userName) => {
  try {
    const response = await apiSession.post("/session", { userName });
    return response.data; // Expected: { sessionId, userName }
  } catch (error) {
    console.log("Error creating session:", error);
    throw error;
  }
};

export const validateSession = async (sessionId) => {
  try {
    const response = await apiSession.get(`/session/${sessionId}`);
    return response.data; // Expected: { sessionId, userName, isValid }
  } catch (error) {
    console.log("Error validating session:", error);
    throw error;
  }
};

// Inventory Items API
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
        const response = await apiClient.put(`items/${itemId}`, itemData);
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

export const getSneakerById = async (id) => {
    try {
        const response = await apiClientSneakers.get(`items/${id}`);
        return response.data?.data || {}; // API wraps object in data property
    } catch (error) {
        console.log("Error fetching sneaker:", error);
        throw error;
    }
};

export default apiClient;