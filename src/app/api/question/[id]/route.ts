import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "daily-challenge",
      `${id}.json`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `Questions for id '${id}' not found` },
        { status: 404 }
      );
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const shuffled = [...jsonData].sort(() => Math.random() - 0.5);

    const { searchParams } = new URL(request.url);
    const numParam = searchParams.get("num");

    if (numParam) {
      const num = parseInt(numParam);
      if (isNaN(num) || num < 1) {
        return NextResponse.json(
          { error: "Invalid number of questions" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        shuffled.slice(0, Math.min(num, jsonData.length))
      );
    }

    return NextResponse.json(shuffled);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
