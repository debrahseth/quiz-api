import { NextRequest, NextResponse } from "next/server";
import coursesData from "../../../data/challenge.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const program = searchParams.get("program");
  const level = searchParams.get("level");
  const semester = searchParams.get("semester");

  let filteredCourses = coursesData;

  if (program) {
    filteredCourses = filteredCourses.filter(
      (course) => course.program.toLowerCase() === program.toLowerCase()
    );
  }
  if (level) {
    filteredCourses = filteredCourses.filter(
      (course) => course.level.toLowerCase() === level.toLowerCase()
    );
  }
  if (semester) {
    filteredCourses = filteredCourses.filter(
      (course) => course.semester.toLowerCase() === semester.toLowerCase()
    );
  }

  return NextResponse.json(filteredCourses);
}
