import { prisma } from "@/lib/prisma";
import type { PreorderFormData, PreorderQueryParams } from "@/types/preorder";

const DEFAULT_LIMIT = 10;

function normalizePreorderData(data: PreorderFormData) {
  return {
    title: data.title,
    customerName: data.customerName ?? data.title,
    email: data.email,
    phone: data.phone,
    quantity: data.quantity,
    price: data.price ?? 0,
    preorderWhen: data.preorderWhen,
    startsAt: data.startsAt ? new Date(data.startsAt) : new Date(),
    endsAt: data.endsAt ? new Date(data.endsAt) : null,
    status: data.status,
  };
}

export async function getPreorders(params: PreorderQueryParams) {
  const {
    filter = "ALL",
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = DEFAULT_LIMIT,
  } = params;

  const where = filter === "ALL" ? {} : { status: filter };
  const orderBy = { [sortBy]: sortOrder } as Record<string, "asc" | "desc">;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.preorder.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.preorder.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getPreorderById(id: string) {
  return prisma.preorder.findUnique({ where: { id } });
}

export async function createPreorder(data: PreorderFormData) {
  return prisma.preorder.create({ data: normalizePreorderData(data) });
}

export async function updatePreorder(id: string, data: PreorderFormData) {
  return prisma.preorder.update({
    where: { id },
    data: normalizePreorderData(data),
  });
}

export async function deletePreorder(id: string) {
  return prisma.preorder.delete({ where: { id } });
}
