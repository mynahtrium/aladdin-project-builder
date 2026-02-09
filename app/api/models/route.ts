import { NextResponse } from "next/server";

type ModelListResponse = {
  models: string[];
};

export async function POST(req: Request) {
  // Exclusively return flagship models as requested
  const models = [
    "gemini-3-pro-preview",
    "gemini-3-flash-preview",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
  ];

  const payload: ModelListResponse = { models };
  return NextResponse.json(payload);
}
