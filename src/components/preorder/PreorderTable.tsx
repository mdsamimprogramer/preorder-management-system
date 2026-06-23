"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  PreorderItem,
  PreorderFilter,
  PreorderSortBy,
} from "@/types/preorder";

interface PreorderTableProps {
  items: PreorderItem[];
  filter: PreorderFilter;
  sortBy: PreorderSortBy;
  sortOrder: "asc" | "desc";
  page: number;
  pages: number;
  total: number;
  limit: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function PreorderTable({
  items: initialItems,
  filter,
  sortBy,
  sortOrder,
  page,
  pages,
  total,
  limit,
}: PreorderTableProps) {
  const [items, setItems] = useState(initialItems);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const allSelected = useMemo(
    () => items.length > 0 && checkedIds.length === items.length,
    [items.length, checkedIds],
  );

  const updateItem = (id: string, patch: Partial<PreorderItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setCheckedIds((current) => current.filter((itemId) => itemId !== id));
  };

  const toggleSelection = (id: string) => {
    setCheckedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    setCheckedIds(allSelected ? [] : items.map((item) => item.id));
  };

  const getQuery = (
    overrides: Partial<
      Record<"filter" | "sortBy" | "sortOrder" | "page", string>
    >,
  ) => {
    const params = new URLSearchParams({
      filter,
      sortBy,
      sortOrder,
      page: String(page),
      limit: String(limit),
      ...overrides,
    });
    return `/preorders?${params.toString()}`;
  };

  const handleToggleStatus = async (id: string) => {
    const item = items.find((value) => value.id === id);
    if (!item) return;

    const nextStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setActionLoading(true);

    const response = await fetch(`/api/preorders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title,
        customerName: item.customerName,
        email: item.email,
        phone: item.phone,
        quantity: item.quantity,
        price: item.price,
        status: nextStatus,
      }),
    });

    setActionLoading(false);
    if (response.ok) {
      updateItem(id, { status: nextStatus });
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    const response = await fetch(`/api/preorders/${id}`, { method: "DELETE" });
    setActionLoading(false);
    if (response.ok) {
      removeItem(id);
    }
  };

  const handleDeleteSelected = async () => {
    if (checkedIds.length === 0) return;
    setActionLoading(true);

    await Promise.all(
      checkedIds.map(async (id) => {
        await fetch(`/api/preorders/${id}`, { method: "DELETE" });
      }),
    );

    setActionLoading(false);
    setItems((current) =>
      current.filter((item) => !checkedIds.includes(item.id)),
    );
    setCheckedIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {(["ALL", "ACTIVE", "INACTIVE"] as PreorderFilter[]).map(
              (value) => (
                <Link
                  key={value}
                  href={getQuery({ filter: value, page: "1" })}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${filter === value ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                >
                  {value === "ALL" ? "All" : value}
                </Link>
              ),
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(["title", "price", "createdAt"] as PreorderSortBy[]).map(
              (key) => (
                <Link
                  key={key}
                  href={getQuery({
                    sortBy: key,
                    sortOrder:
                      sortBy === key && sortOrder === "asc" ? "desc" : "asc",
                    page: "1",
                  })}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${sortBy === key ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                >
                  Sort by{" "}
                  {key === "createdAt"
                    ? "Date"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              ),
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Selected {checkedIds.length} of {items.length}
          </p>
          <button
            type="button"
            onClick={handleDeleteSelected}
            disabled={actionLoading || checkedIds.length === 0}
            className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete selected
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-xl font-semibold text-slate-900">
              No preorders available
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Use the create button to add a preload.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                    />
                    Select
                  </label>
                </th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checkedIds.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                    </label>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">
                      {item.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {item.email ?? "No email"}
                    </div>
                  </td>
                  <td className="px-4 py-4">{item.customerName}</td>
                  <td className="px-4 py-4">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-4">{item.quantity}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right space-x-2">
                    <Link
                      href={`/preorders/${item.id}`}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id)}
                      disabled={actionLoading}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {item.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={actionLoading}
                      className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Showing page {page} of {pages}. Total preorders: {total}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={getQuery({ page: String(Math.max(1, page - 1)) })}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:border-slate-400 hover:bg-slate-100"
          >
            Previous
          </Link>
          <Link
            href={getQuery({ page: String(Math.min(pages, page + 1)) })}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:border-slate-400 hover:bg-slate-100"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
