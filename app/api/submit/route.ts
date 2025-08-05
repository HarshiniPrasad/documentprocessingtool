// /app/api/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("📥 Received final form data:", body);
  return NextResponse.json({ success: true });
}
