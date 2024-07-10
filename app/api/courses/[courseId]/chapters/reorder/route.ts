import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { list } = await req.json();

    console.log("LIST OF REORDERED CHAPTERS", list);

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!ownCourse) return new NextResponse("Unauthorized", { status: 401 });

    for (let item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    revalidatePath(`/teacher/courses/${params.courseId}`);

    return new NextResponse("Successfully reordered", { status: 200 });
  } catch (error) {
    console.log("ERROR COURSE REORDER CHAPTER", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
