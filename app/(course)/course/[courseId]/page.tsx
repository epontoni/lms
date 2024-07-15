import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const { userId } = auth();

  if (!userId) redirect("/");

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/");

  return redirect(`/course/${course.id}/chapter/${course.chapters[0].id}`);
  return <div>Chapter!</div>;
}
