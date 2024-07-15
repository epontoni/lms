import { Chapter, Course, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseSidebar from "./CourseSidebar";

export default function CourseMobileSidebar({
  course,
  progressCount,
}: CourseMobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pl-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
}
