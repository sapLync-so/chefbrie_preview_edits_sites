import { NextResponse } from "next/server";

/** Preview snapshot: contact submissions are intentionally disabled. */
export async function POST() {
  return NextResponse.json(
    {
      error: "Contact form is disabled in this client preview.",
      preview: true,
    },
    { status: 503 },
  );
}

export async function GET() {
  return NextResponse.json({ enabled: false, preview: true });
}
