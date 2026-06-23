import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 shadow-card">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Preorder Manager
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              Build better preorder workflows.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Use the admin dashboard to create, update, filter, and manage your
              preorder records in one place.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/preorders"
              className="rounded-2xl bg-slate-900 px-6 py-4 text-center text-white transition hover:bg-slate-700"
            >
              View Preorders
            </Link>
            <Link
              href="/preorders/create"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Create Preorder
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
