import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) return new NextResponse("Unauthorized", { status: 401 });

    // const chapter = await db.chapter.findUnique({
    //   where: {
    //     id: params.chapterId,
    //     courseId: params.courseId,
    //   },
    // });

    // const muxData = db.muxData.findUnique({
    //   where: {
    //     chapterId: params.chapterId,
    //   },
    // });

    // if (
    //   !chapter ||
    //   !chapter.title ||
    //   !chapter.description ||
    //   !chapter.videoUrl ||
    //   (!muxData && !/youtu/.test(chapter?.videoUrl)) // muxData no tiene enlace de YT
    // ) {
    //   return new NextResponse("Missing required fields", { status: 401 });
    // }

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });

    // Es este el único chapter a publicado?
    // Si es así, como lo estamos despublicando, debemos despublicar el Curso
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    revalidatePath(`/teacher/courses/${params.courseId}`);
    if (unpublishedChapter) return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("CHAPTER UNPUBLISH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
