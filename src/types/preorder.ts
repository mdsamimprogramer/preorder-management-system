export type PreorderStatus = "ACTIVE" | "INACTIVE";

export function toPreorderStatus(value: string | null | undefined): PreorderStatus {
  return value === "INACTIVE" ? "INACTIVE" : "ACTIVE";
}

export interface PreorderFormData {
  title: string;
  customerName: string;
  email?: string;
  phone?: string;
  quantity: number;
  price: number;
  status: PreorderStatus;
}

export type PreorderFilter = "ALL" | PreorderStatus;
export type PreorderSortBy = "title" | "price" | "createdAt";

export interface PreorderQueryParams {
  filter?: PreorderFilter;
  sortBy?: PreorderSortBy;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PreorderItem {
  id: string;
  title: string;
  customerName: string;
  email?: string;
  phone?: string;
  quantity: number;
  price: number;
  status: PreorderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PreorderListResult {
  items: PreorderItem[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}
