import Link from "next/link";
import CreatePreorderClient from "@/components/preorder/CreatePreorderClient";

export default function CreatePreorderPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Create preorder
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Add a new preorder
            </h1>
          </div>
          <Link
            href="/preorders"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            Back to list
          </Link>
        </div>

        <CreatePreorderClient />
      </div>
    </main>
  );
}
