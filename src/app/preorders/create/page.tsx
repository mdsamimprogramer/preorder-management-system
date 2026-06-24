import Link from "next/link";
import CreatePreorderClient from "@/components/preorder/CreatePreorderClient";

export default function CreatePreorderPage() {
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

        <CreatePreorderClient />
      </div>
    </main>
  );
}
