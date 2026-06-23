import type { FormEventHandler } from "react";
import type { PreorderFormData } from "@/types/preorder";

interface PreorderFormProps {
  action: string;
  defaultValues?: Partial<PreorderFormData>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  submitLabel?: string;
}

export function PreorderForm({
  action,
  defaultValues = {},
  onSubmit,
  submitLabel = "Save preorder",
}: PreorderFormProps) {
  return (
    <form action={action} onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-900">Title</span>
          <input
            name="title"
            type="text"
            defaultValue={defaultValues.title ?? ""}
            required
            className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-900">
            Customer name
          </span>
          <input
            name="customerName"
            type="text"
            defaultValue={defaultValues.customerName ?? ""}
            required
            className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-900">Email</span>
          <input
            name="email"
            type="email"
            defaultValue={defaultValues.email ?? ""}
            className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-900">Phone</span>
          <input
            name="phone"
            type="tel"
            defaultValue={defaultValues.phone ?? ""}
            className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-900">Quantity</span>
          <input
            name="quantity"
            type="number"
            min="1"
            defaultValue={defaultValues.quantity ?? 1}
            required
            className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-900">Price</span>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues.price ?? 0}
            required
            className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-900">Status</span>
          <select
            name="status"
            defaultValue={defaultValues.status ?? "ACTIVE"}
            className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Fill the fields and save the preorder.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
