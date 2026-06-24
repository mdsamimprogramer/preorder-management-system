"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PreorderForm } from "./PreorderForm";
import type {
  PreorderStatus,
  PreorderWhen,
} from "@/types/preorder";

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
      customerName: preorder.customerName || String(formData.get("title") ?? ""),
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
    <>
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
    </>
  );
}
