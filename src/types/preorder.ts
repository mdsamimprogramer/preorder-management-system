export type PreorderStatus = "ACTIVE" | "INACTIVE";
export type PreorderWhen = "regardless-of-stock" | "out-of-stock";

export function toPreorderStatus(value: string | null | undefined): PreorderStatus {
  return value === "INACTIVE" ? "INACTIVE" : "ACTIVE";
}

export function toPreorderWhen(value: string | null | undefined): PreorderWhen {
  return value === "out-of-stock" ? "out-of-stock" : "regardless-of-stock";
}

export interface PreorderFormData {
  title: string;
  customerName?: string;
  email?: string;
  phone?: string;
  quantity: number;
  price?: number;
  preorderWhen: PreorderWhen;
  startsAt: string;
  endsAt?: string | null;
  status: PreorderStatus;
}

export type PreorderFilter = "ALL" | PreorderStatus;
export type PreorderSortBy = "title" | "createdAt" | "startsAt" | "endsAt";

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
  preorderWhen: PreorderWhen;
  startsAt: string;
  endsAt?: string | null;
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
