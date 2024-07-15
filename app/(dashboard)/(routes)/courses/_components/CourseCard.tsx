import CourseProgress from "@/components/course-progress";
import { IconBadge } from "@/components/icon-badge";
import { Badge } from "@/components/ui/badge";
import { CourseWithProgressWithCategory } from "@/lib/actions/course.actions";
import { formatPrice } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CourseCard({
  info,
}: {
  info: CourseWithProgressWithCategory;
}) {
  return (
    <Link href={`course/${info.id}`}>
      <div className="group hover:shadow-sm hover:bg-secondary transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md">
          <Image
            fill
            className="object-cover"
            alt={info.title}
            src={info.imageUrl!}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-primary transition line-clamp-2">
            {info.title}
          </div>
          <p className="text-xs text-muted-foreground">
            {info?.category?.name}
          </p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-muted-foreground">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {info.chapters.length}{" "}
                {info.chapters.length === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {info.progress !== null ? (
            <CourseProgress
              size="sm"
              variant={info.progress === 100 ? "success" : "default"}
              value={info.progress}
            />
          ) : (
            <p className="text-sm md:text-md text-muted-foreground font-medium ">
              {info.price === 0 ? (
                <Badge>FREE</Badge>
              ) : (
                formatPrice(info.price!)
              )}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
