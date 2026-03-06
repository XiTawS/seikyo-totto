import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Content from "@/lib/models/Content";
import { auth } from "@/lib/auth";

const SITE_ID = process.env.SITE_ID || "coiffure-ayme";

export async function GET(req: NextRequest) {
  await dbConnect();
  const page = req.nextUrl.searchParams.get("page");
  const filter: any = { siteId: SITE_ID, type: "content" };
  if (page) filter.page = page;
  const items = await Content.find(filter).lean();
  const map: Record<string, string> = {};
  for (const item of items) {
    if ((item as any).key && (item as any).value) {
      map[(item as any).key] = (item as any).value;
    }
  }
  return NextResponse.json(map);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { key, value, contentType, page } = await req.json();
  await Content.findOneAndUpdate(
    { siteId: SITE_ID, key },
    {
      siteId: SITE_ID,
      type: "content",
      key,
      value,
      contentType: contentType || "text",
      page: page || key.split(".")[0],
    },
    { upsert: true, new: true }
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const { key } = await req.json();
  await Content.deleteOne({ siteId: SITE_ID, key });
  return NextResponse.json({ ok: true });
}
