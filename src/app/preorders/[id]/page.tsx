import Link from "next/link";
import EditPreorderClient from "@/components/preorder/EditPreorderClient";
import { getPreorderById } from "@/services/preorder.service";
import {
  toPreorderStatus,
  toPreorderWhen,
  type PreorderItem,
} from "@/types/preorder";

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
    preorderWhen: toPreorderWhen(preorder.preorderWhen),
    startsAt: preorder.startsAt.toISOString(),
    endsAt: preorder.endsAt?.toISOString() ?? null,
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
      <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
        <div className="mx-auto max-w-[720px] rounded-xl border border-[#d9dbde] bg-white p-10 text-center shadow-sm">
          <p className="text-[18px] font-bold text-[#202328]">
            Preorder not found
          </p>
          <Link
            href="/preorders"
            className="mt-6 inline-flex h-9 items-center justify-center rounded-md border border-[#d7dade] bg-white px-4 text-[13px] font-bold text-[#202328] hover:bg-[#f3f3f4]"
          >
            Back to list
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-6 text-[#202328]">
      <div className="mx-auto w-full max-w-[820px]">
        <div className="mb-7 flex items-center justify-between">
          <Link
            href="/preorders"
            className="inline-flex h-9 items-center justify-center rounded-md border border-[#d7dade] bg-white px-4 text-[13px] font-bold text-[#202328] shadow-sm hover:bg-[#f3f3f4]"
          >
            &lt; Back
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/preorders"
              className="inline-flex h-9 items-center justify-center rounded-md border border-[#d7dade] bg-white px-4 text-[13px] font-bold text-[#202328] shadow-sm hover:bg-[#f3f3f4]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              form="preorder-form"
              className="inline-flex h-9 items-center justify-center rounded-md bg-[#1f2023] px-5 text-[13px] font-bold text-white shadow-sm ring-1 ring-black/20 hover:bg-black"
            >
              Save changes
            </button>
          </div>
        </div>

        <EditPreorderClient preorder={preorder} />
      </div>
    </main>
  );
}
