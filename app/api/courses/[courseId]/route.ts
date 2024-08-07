import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isTeacher } from "@/lib/actions/teacher.actions";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const isAuthorized = isTeacher(userId);
    const { courseId } = params;

    if (!userId || !isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await mux.video.assets.delete(chapter.muxData.assetId);
      }
    }

    // TODO: Delete Image of course
    const deletedCourse = await db.course.delete({ where: { id: courseId } });

    if (deletedCourse) {
      revalidatePath(`/teacher/courses`);
      return NextResponse.json(deletedCourse);
    }
  } catch (error) {
    console.log("[COURSE_ID_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const isAuthorized = isTeacher(userId);
    const { courseId } = params;
    const values = await req.json();

    if (!userId || !isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    if (course) {
      return NextResponse.json(course);
    }
  } catch (error) {
    console.log("[COURSEID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
