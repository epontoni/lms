"use client";

import { cn } from "@/lib/utils";
import { Chapter, Purchase, UserProgress } from "@prisma/client";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
  chapter: Chapter & {
    userProgress: UserProgress[] | null;
  };
  purchase: Purchase | null;
}

export default function CourseSidebarItem({
  chapter,
  purchase,
}: CourseSidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isLocked = !chapter.isFree && !purchase;
  const isCompleted = !!chapter?.userProgress?.[0]?.isCompleted;
  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const isActive = pathname?.includes(chapter.id);

  const onClick = () => {
    router.push(`/course/${chapter.courseId}/chapter/${chapter.id}`);
  };
  return (
    <button type="button" onClick={onClick}>
      <div
        className={cn(
          "flex items-center gap-x-2 bg:bg-slate-300/20 text-ellipsis text-muted-foreground text-sm font-[500] transition-all duration-150 hover:bg-secondary md:w-full md:text-left md:rounded-none h-[50px] pl-2",
          isActive &&
            "text-primary bg-primary-foreground md:border-r-2 md:border-r-primary",
          isCompleted && "text-emerald-700 hover:text-emerald-500",
          isCompleted && isActive && "bg-emerald-200/20"
        )}
      >
        <Icon className="w-5 h-fit" />
        {chapter.title}
      </div>
    </button>
  );
}
