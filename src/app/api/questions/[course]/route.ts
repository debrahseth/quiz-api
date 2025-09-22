import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ course: string }> }
) {
  const { searchParams } = new URL(request.url);
  const num = parseInt(searchParams.get("num") || "10");

  if (isNaN(num) || num < 1 || num > 50) {
    return NextResponse.json(
      { error: "Invalid number of questions (must be between 1 and 50)" },
      { status: 400 }
    );
  }

  // Resolve the params promise
  const params = await context.params;
  const { course } = params;

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "questions",
      `${course}.json`
    );
    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
      return NextResponse.json(
        { error: `Questions for course '${course}' not found` },
        { status: 404 }
      );
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const shuffled = [...jsonData].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(num, jsonData.length));

    return NextResponse.json(selected);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
