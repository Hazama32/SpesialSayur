// lib/api.ts
import axios from 'axios';
import {
  Product,
  Category,
  User,
  StrapiCollectionResponse,
  StrapiSingleResponse,
  Order,
  ProductAttributes,
  CategoryAttributes,
  OrderAttributes
} from '../types';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

if (!STRAPI_BASE_URL) {
  throw new Error('NEXT_PUBLIC_STRAPI_API_URL is not defined in your environment variables.');
}

// Ensure the URL ends with /api if it doesn't already
const API_URL = STRAPI_BASE_URL.endsWith('/api') ? STRAPI_BASE_URL : `${STRAPI_BASE_URL}/api`;


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the JWT token for authenticated requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// --- Authentication Endpoints ---
export const registerUser = async (userData: any): Promise<{ jwt: string; user: User }> => {
  try {
    const response = await api.post('/auth/local/register', userData);
    return response.data; // Contains user and JWT
  } catch (error: any) {
    throw error.response?.data?.error || new Error('Registration failed');
  }
};

export const loginUser = async (credentials: any): Promise<{ jwt: string; user: User }> => {
  try {
    const response = await api.post('/auth/local', credentials);
    return response.data; // Contains user and JWT
  } catch (error: any) {
    throw error.response?.data?.error || new Error('Login failed');
  }
};

// --- User Endpoints ---
export const getMe = async (): Promise<User> => {
  try {
    const response = await api.get('/users/me'); // Requires authentication
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// --- Product Endpoints ---
export const getProducts = async (categorySlug?: string): Promise<Product[]> => {
  try {
    let url = '/products?populate=image,category'; // Always populate image and category
    if (categorySlug && categorySlug !== 'all') {
      url += `&filters[category][slug][$eq]=${categorySlug}`;
    }
    const response = await api.get<StrapiCollectionResponse<ProductAttributes>>(url);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<StrapiSingleResponse<ProductAttributes>>(`/products/${id}?populate=image,category`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// --- Category Endpoints ---
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<StrapiCollectionResponse<CategoryAttributes>>('/categories');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// --- Order Endpoints ---
export const createOrder = async (orderData: Partial<OrderAttributes>): Promise<Order> => {
  try {
    const response = await api.post<StrapiSingleResponse<OrderAttributes>>('/orders', { data: orderData });
    return response.data.data;
  } catch (error: any) {
    console.error('Error creating order:', error.response?.data?.error || error);
    throw error.response?.data?.error || new Error('Order creation failed');
  }
};

export const getOrderById = async (id: string): Promise<Order> => {
  try {
    // Populate order_items and product details within them
    const response = await api.get<StrapiSingleResponse<OrderAttributes>>(`/orders/${id}?populate=orderItems.product`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

export const getMyOrders = async (userId: number): Promise<Order[]> => {
  try {
    // This assumes your Strapi Order collection has a 'user' relation
    // and you can filter by user ID.
    // If not, you might need a custom endpoint in Strapi or fetch all and filter.
    const response = await api.get<StrapiCollectionResponse<OrderAttributes>>(
      `/orders?filters[user][id][$eq]=${userId}&populate=orderItems.product`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// --- Utility to get full Strapi image URL ---
export const getStrapiMediaUrl = (url: string | undefined | null): string => {
  if (!url) return '/images/placeholder.png'; // Default placeholder
  // Check if it's already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Remove '/api' from base URL for asset path
  const baseUrlWithoutApi = STRAPI_BASE_URL?.replace('/api', '');
  return `${baseUrlWithoutApi}${url}`;
};