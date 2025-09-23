import { NextRequest, NextResponse } from "next/server";
import riddlesData from "../../../data/riddles.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const num = parseInt(searchParams.get("num") || "10");

  if (isNaN(num) || num < 1 || num > 50) {
    return NextResponse.json(
      { error: "Invalid number of riddles (must be between 1 and 50)" },
      { status: 400 }
    );
  }

  const shuffledRiddles = [...riddlesData].sort(() => Math.random() - 0.5);
  const selectedRiddles = shuffledRiddles.slice(
    0,
    Math.min(num, riddlesData.length)
  );

  return NextResponse.json(selectedRiddles);
}
