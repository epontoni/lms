import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, attachmentId } = params;

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

    const deletedAttachment = await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    if (deletedAttachment) {
      return NextResponse.json(deletedAttachment);
    }
  } catch (error) {
    console.log("[COURSEID_ATTACHMENTS_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
