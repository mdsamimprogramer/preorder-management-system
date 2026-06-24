import Link from "next/link";
import { getPreorders } from "@/services/preorder.service";
import type {
  PreorderFilter,
  PreorderSortBy,
} from "@/types/preorder";

const DEFAULT_LIMIT = 10;

type PreorderSearchParams = {
  filter?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
};

interface PageProps {
  searchParams?: Promise<PreorderSearchParams>;
}

async function fetchPreorders({
  filter = "ALL",
  sortBy = "createdAt",
  sortOrder = "desc",
  page = "1",
}: PreorderSearchParams = {}) {
  const result = await getPreorders({
    filter: filter as PreorderFilter,
    sortBy: sortBy as PreorderSortBy,
    sortOrder: sortOrder as "asc" | "desc",
    page: Number(page) || 1,
    limit: DEFAULT_LIMIT,
  });

  return {
    ...result,
    items: result.items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function PreordersPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const result = await fetchPreorders(resolvedSearchParams);
  const { items, total, page, pages } = result;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Preorders
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Manage preorders
              </h1>
            </div>
            <Link
              href="/preorders/create"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Create preorder
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["ALL", "ACTIVE", "INACTIVE"].map((value) => (
              <Link
                key={value}
                href={`/preorders?filter=${value}&sortBy=${resolvedSearchParams?.sortBy ?? "createdAt"}&sortOrder=${resolvedSearchParams?.sortOrder ?? "desc"}&page=1`}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${resolvedSearchParams?.filter === value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}
              >
                {value === "ALL"
                  ? "All preorders"
                  : `${value.charAt(0) + value.slice(1).toLowerCase()} preorders`}
              </Link>
            ))}
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200">
            {items.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-xl font-semibold text-slate-900">
                  No preorders found
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Create a preorder to get started.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
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
                  {items.map((preorder: any) => (
                    <tr key={preorder.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">
                          {preorder.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {preorder.email ?? "No email"}
                        </div>
                      </td>
                      <td className="px-4 py-4">{preorder.customerName}</td>
                      <td className="px-4 py-4">
                        {formatCurrency(preorder.price)}
                      </td>
                      <td className="px-4 py-4">{preorder.quantity}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${preorder.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
                        >
                          {preorder.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {new Date(preorder.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/preorders/${preorder.id}`}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit
                        </Link>
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
                href={`/preorders?filter=${resolvedSearchParams?.filter ?? "ALL"}&sortBy=${resolvedSearchParams?.sortBy ?? "createdAt"}&sortOrder=${resolvedSearchParams?.sortOrder ?? "desc"}&page=${Math.max(1, page - 1)}`}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                Previous
              </Link>
              <Link
                href={`/preorders?filter=${resolvedSearchParams?.filter ?? "ALL"}&sortBy=${resolvedSearchParams?.sortBy ?? "createdAt"}&sortOrder=${resolvedSearchParams?.sortOrder ?? "desc"}&page=${Math.min(pages, page + 1)}`}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:border-slate-400 hover:bg-slate-100"
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
