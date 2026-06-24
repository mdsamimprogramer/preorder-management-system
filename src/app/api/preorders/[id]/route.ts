import { NextResponse } from "next/server";
import {
  deletePreorder,
  getPreorderById,
  updatePreorder,
} from "@/services/preorder.service";
import type { PreorderFormData } from "@/types/preorder";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const preorder = await getPreorderById(id);

  if (!preorder) {
    return NextResponse.json({ error: "Preorder not found" }, { status: 404 });
  }

  return NextResponse.json(preorder);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = (await request.json()) as PreorderFormData;
  const preorder = await updatePreorder(id, payload);

  return NextResponse.json(preorder);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deletePreorder(id);
  return NextResponse.json({ success: true });
}
