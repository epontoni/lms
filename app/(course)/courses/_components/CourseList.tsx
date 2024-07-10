import { CourseWithProgressWithCategory } from "@/lib/actions/course.actions";
import { Course } from "@prisma/client";
import { Frown } from "lucide-react";
import CourseCard from "./CourseCard";

interface CourseListProps {
  items: CourseWithProgressWithCategory[];
}

export default function CourseList({ items }: CourseListProps) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {items?.map((course) => (
        <CourseCard key={course.id} info={course} />
      ))}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground mt-10">
          <Frown />
          No courses found
        </div>
      )}
    </div>
  );
}
