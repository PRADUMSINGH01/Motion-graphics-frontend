import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    conversations: [],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { title = "Untitled Motion", prompt = "", category = "Kinetic Typography" } = body || {};

    const id = `conv-${Date.now()}`;
    return NextResponse.json({
      success: true,
      conversation: {
        id,
        title: title || prompt || "Untitled Motion",
        category,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        messages: prompt ? [{ role: "user", content: prompt }] : [],
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      conversation: {
        id: `conv-${Date.now()}`,
        title: "Untitled Motion",
        updatedAt: new Date().toISOString(),
      },
    });
  }
}
