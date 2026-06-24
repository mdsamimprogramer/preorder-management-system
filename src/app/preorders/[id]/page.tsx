import Link from "next/link";
import EditPreorderClient from "@/components/preorder/EditPreorderClient";
import { getPreorderById } from "@/services/preorder.service";
import { toPreorderStatus, type PreorderItem } from "@/types/preorder";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPreorder(id: string): Promise<PreorderItem | null> {
  const preorder = await getPreorderById(id);
  if (!preorder) return null;

  return {
    id: preorder.id,
    title: preorder.title,
    customerName: preorder.customerName,
    email: preorder.email ?? undefined,
    phone: preorder.phone ?? undefined,
    quantity: preorder.quantity,
    price: preorder.price,
    status: toPreorderStatus(preorder.status),
    createdAt: preorder.createdAt.toISOString(),
    updatedAt: preorder.updatedAt.toISOString(),
  };
}

export default async function EditPreorderPage({ params }: PageProps) {
  const { id } = await params;
  const preorder = await getPreorder(id);

  if (!preorder) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-card text-center">
          <p className="text-xl font-semibold text-slate-900">
            Preorder not found
          </p>
          <Link
            href="/preorders"
            className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 hover:bg-slate-50"
          >
            Back to list
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Edit preorder
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Update preorder details
            </h1>
          </div>
          <Link
            href="/preorders"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            Back to list
          </Link>
        </div>

        <EditPreorderClient preorder={preorder} />
      </div>
    </main>
  );
}
