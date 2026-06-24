import { NextResponse } from "next/server";
import { getPreorders, createPreorder } from "@/services/preorder.service";
import type { PreorderFormData } from "@/types/preorder";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") as
    | "ALL"
    | "ACTIVE"
    | "INACTIVE"
    | null;
  const sortBy = searchParams.get("sortBy") as
    | "title"
    | "createdAt"
    | "startsAt"
    | "endsAt"
    | null;
  const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" | null;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");

  const result = await getPreorders({
    filter: filter || "ALL",
    sortBy: sortBy || "createdAt",
    sortOrder: sortOrder || "desc",
    page: page < 1 ? 1 : page,
    limit: limit < 1 ? 10 : limit,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as PreorderFormData;
  const preorder = await createPreorder(payload);

  return NextResponse.json(preorder, { status: 201 });
}
