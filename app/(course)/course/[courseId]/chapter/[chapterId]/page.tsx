import Banner from "@/components/banner";
import { getChapter } from "@/lib/actions/chapter.actions";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoPlayer from "../../../_components/VideoPlayer";
import CourseEnrollmentButton from "../../../_components/CourseEnrollmentButton";
import { Separator } from "@/components/ui/separator";
import DOMPurify from "isomorphic-dompurify";
import CourseProgressButton from "../../../_components/CourseProgressButton";
//import InternalProvider from "@/components/mercadopago/ContextProvider";

export default async function ChapterPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { userId } = auth();

  if (!userId) redirect("/");

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!chapter || !course) return redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!} // Check the !
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            videoUrl={chapter.videoUrl!} // Check the !
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollmentButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(chapter.description!),
              }}
            />
          </div>
        </div>
        {!!attachments.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className=""
                >
                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
