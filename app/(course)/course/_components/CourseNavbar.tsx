import Auth from "@/app/(dashboard)/_components/Auth";
import TeacherMode from "@/app/(dashboard)/_components/TeacherMode";
import { ModeToggle } from "@/components/mode-toggle";
import { Chapter, Course, UserProgress } from "@prisma/client";
import CourseMobileSidebar from "./CourseMobileSidebar";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export default function CourseNavbar({
  course,
  progressCount,
}: CourseSidebarProps) {
  return (
    <div className="p-4 border-b h-full flex items-center justify-between shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <div className="flex gap-2 flex-1">
        <TeacherMode />
        <ModeToggle />
        <Auth />
      </div>
    </div>
  );
}
