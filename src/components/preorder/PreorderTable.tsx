"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  PreorderFilter,
  PreorderItem,
  PreorderSortBy,
} from "@/types/preorder";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  SortIcon,
  TrashIcon,
} from "@/components/ui/icons";

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

const sortOptions: Array<{ value: PreorderSortBy; label: string }> = [
  { value: "title", label: "Name" },
  { value: "createdAt", label: "Created At" },
  { value: "startsAt", label: "Starts At" },
  { value: "endsAt", label: "Ends At" },
];

function formatDate(value?: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

function getRange(page: number, limit: number, count: number, total: number) {
  if (total === 0 || count === 0) return { start: 0, end: 0 };

  const start = (page - 1) * limit + 1;
  return { start, end: start + count - 1 };
}

export function PreorderTable({
  items: initialItems,
  filter,
  sortBy,
  sortOrder,
  page,
  pages,
  total: initialTotal,
  limit,
}: PreorderTableProps) {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const allSelected = useMemo(
    () => items.length > 0 && checkedIds.length === items.length,
    [items.length, checkedIds],
  );
  const range = getRange(page, limit, items.length, total);

  useEffect(() => {
    setItems(initialItems);
    setTotal(initialTotal);
    setCheckedIds([]);
  }, [initialItems, initialTotal]);

  useEffect(() => {
    if (!sortOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortOpen]);

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

  const updateItem = (id: string, patch: Partial<PreorderItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setCheckedIds((current) => current.filter((itemId) => itemId !== id));
    setTotal((current) => Math.max(0, current - 1));
  };

  const handleToggleStatus = async (id: string) => {
    const item = items.find((value) => value.id === id);
    if (!item || loadingId) return;

    const nextStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const previousStatus = item.status;
    setLoadingId(id);
    updateItem(id, { status: nextStatus });

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
        preorderWhen: item.preorderWhen,
        startsAt: item.startsAt,
        endsAt: item.endsAt,
        status: nextStatus,
      }),
    });

    setLoadingId(null);
    if (!response.ok) updateItem(id, { status: previousStatus });
  };

  const handleDelete = async (id: string) => {
    if (loadingId) return;

    setLoadingId(id);
    const response = await fetch(`/api/preorders/${id}`, { method: "DELETE" });
    setLoadingId(null);
    if (response.ok) removeItem(id);
  };

  return (
    <div className="overflow-visible rounded-xl border border-[#d6d8db] bg-white shadow-sm">
      <div
        ref={sortRef}
        className="relative flex min-h-12 items-center justify-between border-b border-[#dedfe1] px-3"
      >
        <div className="flex items-center gap-1">
          {(["ALL", "ACTIVE", "INACTIVE"] as PreorderFilter[]).map((value) => (
            <Link
              key={value}
              href={getQuery({ filter: value, page: "1" })}
              className={`rounded-md px-4 py-2 text-[13px] font-bold transition ${
                filter === value
                  ? "bg-[#ededee] text-[#202124]"
                  : "text-[#3d4146] hover:bg-[#f3f3f4]"
              }`}
            >
              {value === "ALL"
                ? "All"
                : value.charAt(0) + value.slice(1).toLowerCase()}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSortOpen((open) => !open)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dcdee0] bg-white text-[#4b4f56] shadow-sm hover:bg-[#f6f6f7]"
          aria-label="Sort preorders"
        >
          <SortIcon />
        </button>

        {sortOpen ? (
          <div className="absolute right-3 top-10 z-20 w-40 rounded-xl border border-[#dadbdd] bg-white py-2 text-[13px] shadow-lg">
            <p className="px-3 pb-1 text-[#464a50]">Sort by</p>
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={getQuery({ sortBy: option.value, page: "1" })}
                onClick={() => setSortOpen(false)}
                className="flex items-center gap-2 px-3 py-1.5 text-[#3e4247] hover:bg-[#f3f3f4]"
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full border ${
                    sortBy === option.value
                      ? "border-[#202124] bg-[#202124] shadow-[inset_0_0_0_3px_white]"
                      : "border-[#aeb2b7]"
                  }`}
                />
                {option.label}
              </Link>
            ))}
            <div className="my-1 border-t border-[#ececee]" />
            <Link
              href={getQuery({ sortOrder: "asc", page: "1" })}
              onClick={() => setSortOpen(false)}
              className={`flex items-center gap-2 px-3 py-1.5 font-bold hover:bg-[#f3f3f4] ${
                sortOrder === "asc" ? "text-[#202124]" : "text-[#5f646b]"
              }`}
            >
              <ArrowUpIcon />
              Ascending
            </Link>
            <Link
              href={getQuery({ sortOrder: "desc", page: "1" })}
              onClick={() => setSortOpen(false)}
              className={`mx-1 flex items-center gap-2 rounded-md px-2 py-1.5 font-bold hover:bg-[#eeeeef] ${
                sortOrder === "desc"
                  ? "bg-[#ececee] text-[#202124]"
                  : "text-[#5f646b]"
              }`}
            >
              <ArrowDownIcon />
              Descending
            </Link>
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse text-left text-[13px] text-[#4e5359]">
          <thead className="bg-[#f7f7f8] text-[13px] font-bold text-[#656970]">
            <tr className="border-b border-[#dedfe1]">
              <th className="w-9 px-3 py-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-[#b9bdc2] accent-[#1f2023]"
                  aria-label="Select all preorders"
                />
              </th>
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Products</th>
              <th className="px-2 py-2">Preorder when</th>
              <th className="px-2 py-2">Starts at</th>
              <th className="px-2 py-2">Ends at</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <p className="font-bold text-[#202124]">No preorders found</p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#e5e5e6] last:border-b-0 hover:bg-[#fafafa]"
                >
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      className="h-4 w-4 rounded border-[#b9bdc2] accent-[#1f2023]"
                      aria-label={`Select ${item.title}`}
                    />
                  </td>
                  <td className="max-w-[220px] px-2 py-2.5 font-bold text-[#272a2f]">
                    <span className="block truncate">{item.title}</span>
                  </td>
                  <td className="px-2 py-2.5">{item.quantity}</td>
                  <td className="px-2 py-2.5">{item.preorderWhen}</td>
                  <td className="px-2 py-2.5">{formatDate(item.startsAt)}</td>
                  <td className="px-2 py-2.5">{formatDate(item.endsAt)}</td>
                  <td className="px-2 py-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id)}
                      disabled={loadingId === item.id}
                      className={`relative h-[18px] w-8 rounded-md transition disabled:opacity-50 ${
                        item.status === "ACTIVE"
                          ? "bg-[#1f2023]"
                          : "bg-[#e8e9eb]"
                      }`}
                      aria-label={`Set ${item.title} status`}
                    >
                      <span
                        className={`absolute top-[3px] h-3 w-3 rounded-[3px] bg-white transition ${
                          item.status === "ACTIVE"
                            ? "right-[3px]"
                            : "left-[3px]"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/preorders/${item.id}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-[#cfd2d5] bg-white text-[#4a4f55] hover:bg-[#f3f3f4]"
                        aria-label={`Edit ${item.title}`}
                      >
                        <PencilIcon />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={loadingId === item.id}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-[#cfd2d5] bg-white text-[#4a4f55] hover:bg-[#f3f3f4] disabled:opacity-50"
                        aria-label={`Delete ${item.title}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex h-10 items-center justify-center gap-3 border-t border-[#e5e5e6] bg-[#f7f7f8] text-[13px] font-bold text-[#34383e]">
        <Link
          href={getQuery({ page: String(Math.max(1, page - 1)) })}
          className={`flex h-7 w-7 items-center justify-center rounded-md ${
            page <= 1
              ? "pointer-events-none bg-[#ececee] text-[#c7c9cc]"
              : "bg-[#ececee] text-[#555a60] hover:bg-[#dedfe1]"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </Link>
        <span>
          Showing {range.start} to {range.end} from {total}
        </span>
        <Link
          href={getQuery({ page: String(Math.min(pages, page + 1)) })}
          className={`flex h-7 w-7 items-center justify-center rounded-md ${
            page >= pages
              ? "pointer-events-none bg-[#ececee] text-[#c7c9cc]"
              : "bg-[#ececee] text-[#555a60] hover:bg-[#dedfe1]"
          }`}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </Link>
      </div>
    </div>
  );
}
