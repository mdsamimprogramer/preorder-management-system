"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PreorderForm } from "./PreorderForm";
import type { PreorderStatus, PreorderWhen } from "@/types/preorder";

interface EditPreorderClientProps {
  preorder: {
    id: string;
    title: string;
    customerName: string;
    email?: string;
    phone?: string;
    quantity: number;
    price: number;
    preorderWhen: PreorderWhen;
    startsAt: string;
    endsAt?: string | null;
    status: PreorderStatus;
  };
}

export default function EditPreorderClient({
  preorder,
}: EditPreorderClientProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    const formData = new FormData(event.currentTarget);

    const payload = {
      title: String(formData.get("title") ?? ""),
      customerName:
        preorder.customerName || String(formData.get("title") ?? ""),
      email: preorder.email,
      phone: preorder.phone,
      quantity: Number(formData.get("quantity") ?? 1),
      price: preorder.price,
      preorderWhen: String(
        formData.get("preorderWhen") ?? "regardless-of-stock",
      ) as PreorderWhen,
      startsAt: String(formData.get("startsAt") ?? ""),
      endsAt: String(formData.get("endsAt") ?? "") || null,
      status: formData.get("active") === "on" ? "ACTIVE" : "INACTIVE",
    };

    try {
      const response = await fetch(`/api/preorders/${preorder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/preorders");
        router.refresh();
        return;
      }

      setError("Could not save preorder. Please try again.");
    } catch {
      setError("Could not save preorder. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
              disabled={isSaving}
              className="inline-flex h-9 items-center justify-center rounded-md bg-[#1f2023] px-5 text-[13px] font-bold text-white shadow-sm ring-1 ring-black/20 hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        <PreorderForm
          action={`/api/preorders/${preorder.id}`}
          defaultValues={preorder}
          isSaving={isSaving}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
        {error ? (
          <p className="mt-3 text-[13px] font-medium text-red-600">{error}</p>
        ) : null}
      </div>
    </main>
  );
}
