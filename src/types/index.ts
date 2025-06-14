// --- Product ---
export interface ProductAttributes {
  nama: string
  harga: number
  kategori?: Category
  gambar?: {
    data?: {
      attributes: {
        url: string
      }
    }
  }
}

export interface Product {
  id: number
  attributes: ProductAttributes
}

// --- Category ---
export interface CategoryAttributes {
  nama: string
  slug: string
}

export interface Category {
  id: number
  attributes: CategoryAttributes
}

// --- User ---
export interface User {
  id: number
  username: string
  email: string
}

// --- Order ---
export interface OrderAttributes {
  user: number | User
  status: string
  totalHarga: number
  orderItems: Array<{
    id: number
    product: Product
    qty: number
  }>
}

export interface Order {
  id: number
  attributes: OrderAttributes
}

// --- Strapi Response Types ---
export interface StrapiCollectionResponse<T> {
  data: Array<{
    id: number
    attributes: T
  }>
}

export interface StrapiSingleResponse<T> {
  data: {
    id: number
    attributes: T
  }
}
