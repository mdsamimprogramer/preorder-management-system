"use client";

import { useRouter } from "next/navigation";
import { PreorderForm } from "./PreorderForm";
import type { PreorderFormData } from "@/types/preorder";

export default function CreatePreorderClient() {
  const router = useRouter();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      title: String(formData.get("title") ?? ""),
      customerName: String(formData.get("customerName") ?? ""),
      email: String(formData.get("email") ?? "") || undefined,
      phone: String(formData.get("phone") ?? "") || undefined,
      quantity: Number(formData.get("quantity") ?? 1),
      price: Number(formData.get("price") ?? 0),
      status: String(
        formData.get("status") ?? "ACTIVE",
      ) as PreorderFormData["status"],
    };

    const response = await fetch("/api/preorders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      router.push("/preorders");
    }
  };

  return (
    <PreorderForm
      action="/api/preorders"
      onSubmit={handleSubmit}
      submitLabel="Save preorder"
    />
  );
}
