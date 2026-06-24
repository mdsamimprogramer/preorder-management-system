import Link from "next/link";
import type { FormEventHandler, ReactNode } from "react";
import type { PreorderFormData } from "@/types/preorder";

interface PreorderFormProps {
  action: string;
  defaultValues?: Partial<PreorderFormData>;
  formId?: string;
  isSaving?: boolean;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  submitLabel?: string;
}

function toDateTimeLocal(value?: string | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function FieldRow({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 border-b border-[#e1e3e5] px-6 py-5 md:grid-cols-[240px_1fr] md:px-7">
      <div>
        <label className="text-[13px] font-bold text-[#202328]">{title}</label>
        <p className="mt-1 max-w-[210px] text-[12px] leading-5 text-[#6f7782]">
          {description}
        </p>
      </div>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

export function PreorderForm({
  action,
  defaultValues = {},
  formId = "preorder-form",
  isSaving = false,
  onSubmit,
  submitLabel = "Save changes",
}: PreorderFormProps) {
  return (
    <form
      id={formId}
      action={action}
      onSubmit={onSubmit}
      className="overflow-hidden rounded-xl border border-[#d9dbde] bg-white shadow-sm"
    >
      <div className="border-b border-[#e1e3e5] px-6 py-5 md:px-7">
        <h2 className="text-[15px] font-bold text-[#202328]">
          Preorder details
        </h2>
        <p className="mt-1 text-[12px] text-[#6f7782]">
          These values appear in the preorders list.
        </p>
      </div>

      <FieldRow
        title={
          <>
            Name <span className="text-red-500">*</span>
          </>
        }
        description="A label to recognize this preorder by."
      >
        <input
          name="title"
          type="text"
          defaultValue={defaultValues.title ?? ""}
          required
          className="h-9 w-full max-w-[460px] rounded-md border border-[#cfd3d8] bg-white px-3 text-[13px] font-medium text-[#202328] outline-none transition focus:border-[#8d949e] focus:ring-2 focus:ring-[#e6e8eb]"
        />
      </FieldRow>

      <FieldRow
        title="Products"
        description="Number of products covered by this preorder."
      >
        <div className="flex items-center gap-3">
          <input
            name="quantity"
            type="number"
            min="1"
            defaultValue={defaultValues.quantity ?? 1}
            required
            className="h-9 w-[150px] rounded-md border border-[#cfd3d8] bg-white px-3 text-[13px] font-medium text-[#202328] outline-none transition focus:border-[#8d949e] focus:ring-2 focus:ring-[#e6e8eb]"
          />
          <span className="text-[12px] font-medium text-[#7b828b]">
            product(s)
          </span>
        </div>
      </FieldRow>

      <FieldRow
        title="Preorder when"
        description="When customers are allowed to preorder."
      >
        <select
          name="preorderWhen"
          defaultValue={defaultValues.preorderWhen ?? "regardless-of-stock"}
          className="h-9 w-full max-w-[460px] rounded-md border border-[#cfd3d8] bg-white px-3 text-[13px] font-medium text-[#202328] outline-none transition focus:border-[#8d949e] focus:ring-2 focus:ring-[#e6e8eb]"
        >
          <option value="regardless-of-stock">regardless-of-stock</option>
          <option value="out-of-stock">out-of-stock</option>
        </select>
      </FieldRow>

      <FieldRow
        title="Starts at"
        description="When the preorder window opens."
      >
        <input
          name="startsAt"
          type="datetime-local"
          defaultValue={toDateTimeLocal(defaultValues.startsAt)}
          required
          className="h-9 w-full max-w-[460px] rounded-md border border-[#cfd3d8] bg-white px-3 text-[13px] font-medium text-[#202328] outline-none transition focus:border-[#8d949e] focus:ring-2 focus:ring-[#e6e8eb]"
        />
      </FieldRow>

      <FieldRow title="Ends at" description="Leave empty for no end date.">
        <input
          name="endsAt"
          type="datetime-local"
          defaultValue={defaultValues.endsAt ? toDateTimeLocal(defaultValues.endsAt) : ""}
          className="h-9 w-full max-w-[460px] rounded-md border border-[#cfd3d8] bg-white px-3 text-[13px] font-medium text-[#202328] outline-none transition focus:border-[#8d949e] focus:ring-2 focus:ring-[#e6e8eb]"
        />
      </FieldRow>

      <FieldRow
        title="Status"
        description="Active preorders are visible to customers."
      >
        <label className="flex items-center gap-3">
          <input
            name="active"
            type="checkbox"
            defaultChecked={(defaultValues.status ?? "ACTIVE") === "ACTIVE"}
            className="peer sr-only"
          />
          <span className="relative h-6 w-10 rounded-md bg-[#e8e9eb] transition peer-checked:bg-[#1f2023]">
            <span className="absolute left-1 top-1 h-4 w-4 rounded-[4px] bg-white transition peer-checked:left-5" />
          </span>
          <span className="text-[13px] font-medium text-[#4d535a]">
            Active
          </span>
        </label>
      </FieldRow>

      <div className="flex justify-end gap-3 bg-[#fbfbfc] px-6 py-4 md:px-7">
        <Link
          href="/preorders"
          className="inline-flex h-9 items-center justify-center rounded-md border border-[#d7dade] bg-white px-4 text-[13px] font-bold text-[#202328] hover:bg-[#f3f3f4]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-9 items-center justify-center rounded-md bg-[#1f2023] px-5 text-[13px] font-bold text-white shadow-sm ring-1 ring-black/20 hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
