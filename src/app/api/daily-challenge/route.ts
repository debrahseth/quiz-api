import { NextRequest, NextResponse } from "next/server";
import dailyChallenges from "../../../data/dailyChallenges.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const program = searchParams.get("program");
  const level = searchParams.get("level");
  const semester = searchParams.get("semester");

  let filtered = dailyChallenges;

  if (program)
    filtered = filtered.filter(
      (c) => c.program.toLowerCase() === program.toLowerCase()
    );
  if (level)
    filtered = filtered.filter(
      (c) => c.level.toLowerCase() === level.toLowerCase()
    );
  if (semester)
    filtered = filtered.filter(
      (c) => c.semester.toLowerCase() === semester.toLowerCase()
    );

  if (filtered.length === 0) {
    return NextResponse.json({ error: "No challenge found" }, { status: 404 });
  }

  const selected = filtered[Math.floor(Math.random() * filtered.length)];

  return NextResponse.json(selected);
}
