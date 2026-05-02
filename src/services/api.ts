// src/services/api.ts
// ====================================
// SERVICE API — Connexion Frontend → Backend Mis22M
// ====================================
// En local (dev)    : http://localhost:5001/api
// En production     : /api  (même domaine Vercel — configuré via VITE_API_URL)

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');

// ─── Types de base ────────────────────────────────────────────────────────────
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erreur API');
  }
  return data;
};

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
  };
  
  if (!(options.body instanceof FormData)) {
    config.headers = { 'Content-Type': 'application/json', ...options.headers };
  }

  try {
    const response = await fetch(url, config);
    return await handleResponse<T>(response);
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

export const uploadAPI = {
  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return request<ApiSuccessResponse<{ urls: string[] }>>('/upload', {
      method: 'POST',
      body: formData,
    });
  }
};

const buildParams = (obj: Record<string, unknown>): string => {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return params.toString();
};

// ─── STORES ──────────────────────────────────────────────────────────────────
export const storesAPI = {
  getAll: (filters: Record<string, unknown> = {}) =>
    request<ApiSuccessResponse<{ stores: Store[]; pagination: Pagination }>>(`/stores?${buildParams(filters)}`),

  getById: (id: string) =>
    request<ApiSuccessResponse<Store>>(`/stores/${id}`),

  searchByLocation: (postalCode: string, radius = 50, range?: string) =>
    request<ApiSuccessResponse<Store[]>>(`/stores/search/location?${buildParams({ postalCode, radius, range })}`),

  getNearby: (lat: number, lng: number, radius = 50) =>
    request<ApiSuccessResponse<Store[]>>(`/stores/nearby?${buildParams({ lat, lng, radius })}`),

  getStats: () =>
    request<ApiSuccessResponse<{ total: number; topCities: unknown[] }>>('/stores/stats'),

  create: (data: Partial<Store>) =>
    request<ApiSuccessResponse<Store>>('/stores', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Store>) =>
    request<ApiSuccessResponse<Store>>(`/stores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<ApiSuccessResponse<{ message: string }>>(`/stores/${id}`, { method: 'DELETE' }),
};

// ─── PRODUCTS ──────────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: (filters: Record<string, unknown> = {}) =>
    request<ApiSuccessResponse<{ products: Product[]; pagination: Pagination }>>(`/products?${buildParams(filters)}`),

  getById: (id: string) =>
    request<ApiSuccessResponse<Product>>(`/products/${id}`),

  getBySlug: (slug: string) =>
    request<ApiSuccessResponse<Product>>(`/products/slug/${slug}`),

  search: (term: string) =>
    request<ApiSuccessResponse<Product[]>>(`/products/search/${encodeURIComponent(term)}`),

  getByCategory: (category: string) =>
    request<ApiSuccessResponse<Product[]>>(`/products/category/${encodeURIComponent(category)}`),

  create: (data: Partial<Product>) =>
    request<ApiSuccessResponse<Product>>('/products', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Product>) =>
    request<ApiSuccessResponse<Product>>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<ApiSuccessResponse<{ message: string }>>(`/products/${id}`, { method: 'DELETE' }),
};

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
export const categoriesAPI = {
  getAll: (includeInactive = false) =>
    request<ApiSuccessResponse<Category[]>>(`/categories${includeInactive ? '?all=true' : ''}`),

  getById: (id: string) =>
    request<ApiSuccessResponse<Category>>(`/categories/${id}`),

  create: (data: Partial<Category>) =>
    request<ApiSuccessResponse<Category>>('/categories', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Category>) =>
    request<ApiSuccessResponse<Category>>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  reorder: (items: { id: string; order: number }[]) =>
    request<ApiSuccessResponse<Category[]>>('/categories/reorder', { method: 'PATCH', body: JSON.stringify({ items }) }),

  delete: (id: string) =>
    request<ApiSuccessResponse<{ message: string }>>(`/categories/${id}`, { method: 'DELETE' }),
};

// ─── FAVORITE VIDEOS ─────────────────────────────────────────────────────────
export const favoriteVideosAPI = {
  getAll: () =>
    request<ApiSuccessResponse<FavoriteVideo[]>>('/favorite-videos'),

  create: (data: Partial<FavoriteVideo>) =>
    request<ApiSuccessResponse<FavoriteVideo>>('/favorite-videos', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<FavoriteVideo>) =>
    request<ApiSuccessResponse<FavoriteVideo>>(`/favorite-videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<ApiSuccessResponse<{ message: string }>>(`/favorite-videos/${id}`, { method: 'DELETE' }),
};

// ─── RANGES ───────────────────────────────────────────────────────────────────
export const rangesAPI = {
  getAll: (includeInactive = false) =>
    request<ApiSuccessResponse<Range[]>>(`/ranges${includeInactive ? '?all=true' : ''}`),

  getById: (id: string) =>
    request<ApiSuccessResponse<Range>>(`/ranges/${id}`),

  create: (data: Partial<Range>) =>
    request<ApiSuccessResponse<Range>>('/ranges', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Range>) =>
    request<ApiSuccessResponse<Range>>(`/ranges/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  reorder: (items: { id: string; order: number }[]) =>
    request<ApiSuccessResponse<Range[]>>('/ranges/reorder', { method: 'PATCH', body: JSON.stringify({ items }) }),

  delete: (id: string) =>
    request<ApiSuccessResponse<{ message: string }>>(`/ranges/${id}`, { method: 'DELETE' }),
};

// ─── TYPES TypeScript ─────────────────────────────────────────────────────────
export interface Store {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
  ranges: string[];
  phone?: string;
  email?: string;
  website?: string;
  googleMapsUrl?: string;
  openingHours?: Record<string, string>;
  services: string[];
  isActive: boolean;
  isFeatured: boolean;
  products?: Product[];
  distance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  category: string;
  ranges: string[];
  skinType: string[];
  volume?: string;
  price?: number;
  oldPrice?: number;
  colors?: string[];
  details?: string[];
  reviewsData?: any;
  activeIngredients: string[];
  ingredients?: string[];
  imageUrl: string;
  images: string[];
  gallery?: string[];
  usageInstructions?: string;
  benefits: string[];
  testDescription?: string; // Section "TEST" — texture, formule
  pack?: string;            // Section "PACK" — infos emballage
  inStock: boolean;
  isActive: boolean;
  isBestSeller?: boolean;
  stores?: Store[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  color?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Range {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteVideo {
  id: string;
  title: string;
  video: string;
  thumbnail?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}