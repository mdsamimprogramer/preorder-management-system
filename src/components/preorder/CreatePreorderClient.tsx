"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PreorderForm } from "./PreorderForm";
import type { PreorderWhen } from "@/types/preorder";

export default function CreatePreorderClient() {
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
      customerName: String(formData.get("title") ?? ""),
      quantity: Number(formData.get("quantity") ?? 1),
      price: 0,
      preorderWhen: String(
        formData.get("preorderWhen") ?? "regardless-of-stock",
      ) as PreorderWhen,
      startsAt: String(formData.get("startsAt") ?? ""),
      endsAt: String(formData.get("endsAt") ?? "") || null,
      status: formData.get("active") === "on" ? "ACTIVE" : "INACTIVE",
    };

    try {
      const response = await fetch("/api/preorders", {
        method: "POST",
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
        action="/api/preorders"
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
