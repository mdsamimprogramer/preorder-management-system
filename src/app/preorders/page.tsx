import Link from "next/link";
import { PreorderTable } from "@/components/preorder/PreorderTable";
import { getPreorders } from "@/services/preorder.service";
import type {
  PreorderFilter,
  PreorderSortBy,
} from "@/types/preorder";
import { toPreorderStatus, toPreorderWhen } from "@/types/preorder";

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
      email: item.email ?? undefined,
      phone: item.phone ?? undefined,
      status: toPreorderStatus(item.status),
      preorderWhen: toPreorderWhen(item.preorderWhen),
      startsAt: item.startsAt.toISOString(),
      endsAt: item.endsAt?.toISOString() ?? null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  };
}

export default async function PreordersPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const result = await fetchPreorders(resolvedSearchParams);
  const { items, total, page, pages } = result;
  const activeFilter = (resolvedSearchParams?.filter ?? "ALL") as PreorderFilter;
  const activeSortBy = (resolvedSearchParams?.sortBy ?? "createdAt") as PreorderSortBy;
  const activeSortOrder = (resolvedSearchParams?.sortOrder ?? "desc") as
    | "asc"
    | "desc";

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8 text-[#1f2328]">
      <div className="mx-auto w-full max-w-[1060px]">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-[22px] font-bold tracking-tight">Preorders</h1>
          <Link
            href="/preorders/create"
            className="inline-flex h-8 items-center justify-center rounded-md bg-[#1f2023] px-4 text-[13px] font-bold text-white shadow-sm ring-1 ring-black/20 transition hover:bg-black"
          >
            Create Preorder
          </Link>
        </div>
        <PreorderTable
          items={items}
          filter={activeFilter}
          sortBy={activeSortBy}
          sortOrder={activeSortOrder}
          page={page}
          pages={pages}
          total={total}
          limit={DEFAULT_LIMIT}
        />
      </div>
    </main>
  );
}
