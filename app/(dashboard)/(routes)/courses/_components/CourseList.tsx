import { CourseWithProgressWithCategory } from "@/lib/actions/course.actions";
import { Course } from "@prisma/client";
import { Frown } from "lucide-react";
import CourseCard from "./CourseCard";
import Link from "next/link";

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
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground mt-10 col-span-2 md:col-span-3 xl:col-span-2 xl:col-start-2">
          <Frown />
          <p>
            No courses found. Explore all courses{" "}
            <Link
              href="/courses"
              className="text-primary hover:underline transition-all"
            >
              here
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
