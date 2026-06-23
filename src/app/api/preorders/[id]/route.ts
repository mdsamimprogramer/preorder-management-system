import { NextResponse } from "next/server";
import {
  deletePreorder,
  getPreorderById,
  updatePreorder,
} from "@/services/preorder.service";
import type { PreorderFormData } from "@/types/preorder";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const preorder = await getPreorderById(params.id);

  if (!preorder) {
    return NextResponse.json({ error: "Preorder not found" }, { status: 404 });
  }

  return NextResponse.json(preorder);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const payload = (await request.json()) as PreorderFormData;
  const preorder = await updatePreorder(params.id, payload);

  return NextResponse.json(preorder);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  await deletePreorder(params.id);
  return NextResponse.json({ success: true });
}
