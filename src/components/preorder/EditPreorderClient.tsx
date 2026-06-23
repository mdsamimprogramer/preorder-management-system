"use client";

import { useRouter } from "next/navigation";
import { PreorderForm } from "./PreorderForm";
import type { PreorderFormData } from "@/types/preorder";

interface EditPreorderClientProps {
  preorder: {
    id: string;
    title: string;
    customerName: string;
    email?: string;
    phone?: string;
    quantity: number;
    price: number;
    status: string;
  };
}

export default function EditPreorderClient({
  preorder,
}: EditPreorderClientProps) {
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

    const response = await fetch(`/api/preorders/${preorder.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      router.push("/preorders");
    }
  };

  return (
    <PreorderForm
      action={`/api/preorders/${preorder.id}`}
      defaultValues={preorder}
      onSubmit={handleSubmit}
      submitLabel="Update preorder"
    />
  );
}
