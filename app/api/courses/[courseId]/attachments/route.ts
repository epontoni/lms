import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url: values.url,
        name: values.url.split("/").pop(),
        courseId: params.courseId,
      },
    });

    if (attachment) {
      return NextResponse.json(attachment);
    }

    // const course = await db.course.update({
    //   where: {
    //     id: courseId,
    //     userId,
    //   },
    //   data: {
    //     ...values,
    //   },
    // });

    // if (course) {
    //   return NextResponse.json(course);
    // }
  } catch (error) {
    console.log("[COURSEID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
