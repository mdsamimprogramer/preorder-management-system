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

  return <EditPreorderClient preorder={preorder} />;
}
