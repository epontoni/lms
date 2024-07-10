import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChapterForm from "./_components/ChapterForm";
import Banner from "@/components/banner";
import CourseActions from "./_components/CourseActions";

export default async function CourseIdPage({
  params: { courseId },
}: {
  params: { courseId: string };
}) {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true,
    },
  });

  console.log("CATEGORIES", categories);

  if (!course) return redirect("/");

  const requiredFiels = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.subCategoryId,
    course.chapters.some((chapter) => chapter.isPublished), // At least one pubished chapter
  ];

  const totalFields = requiredFiels.length;
  const completedFields = requiredFiels.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFiels.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students. At least one chapter must be published." />
      )}
      <div className="p-6">
        <div className="flex flex-col items-center justify-between">
          {/* <div className="flex flex-col gap-y-2 border-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div> */}

          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter creation</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
            </div>
            <CourseActions
              disabled={!isComplete}
              courseId={courseId}
              //chapterId={chapterId}
              isPublished={course.isPublished}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-16 w-full">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your course</h2>
              </div>
              <TitleForm initialData={course} courseId={course.id} />

              <DescriptionForm initialData={course} courseId={course.id} />

              <ImageForm initialData={course} courseId={course.id} />

              <CategoryForm
                initialData={course}
                courseId={course.id}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                  subCategories: category.subCategories.map((subCat) => ({
                    label: subCat.name,
                    value: subCat.id,
                  })),
                }))}
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChapterForm initialData={course} courseId={course.id} />
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <div>
                <PriceForm initialData={course} courseId={courseId} />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File} />
                  <h2 className="text-xl">Attachments</h2>
                </div>
                <div>
                  <AttachmentForm initialData={course} courseId={course.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
