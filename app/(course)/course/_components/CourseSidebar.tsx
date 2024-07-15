import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseSidebarItem from "./CourseSidebarItem";
import CourseProgress from "@/components/course-progress";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}
export default async function CourseSidebar({
  course,
  progressCount,
}: CourseSidebarProps) {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="flex flex-col p-3 border-b justify-center line-clamp-2">
        <h1 className="font-bold text-center">{course.title}</h1>
        {purchase && (
          <div className="my-5">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem chapter={chapter} purchase={purchase} />
        ))}
      </div>
    </div>
  );
}
