import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { course: string } }
) {
  const { searchParams } = new URL(request.url);
  const num = parseInt(searchParams.get("num") || "10");

  if (isNaN(num) || num < 1 || num > 50) {
    return NextResponse.json(
      { error: "Invalid number of questions (must be between 1 and 50)" },
      { status: 400 }
    );
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "questions",
      `${params.course}.json`
    );
    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
      return NextResponse.json(
        { error: `Questions for course '${params.course}' not found` },
        { status: 404 }
      );
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const shuffled = [...jsonData].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(num, jsonData.length));

    return NextResponse.json(selected);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
