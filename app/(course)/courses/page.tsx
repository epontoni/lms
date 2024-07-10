import { db } from "@/lib/db";
import Categories from "./_components/Categories";
import SearchInput from "@/components/search-input";
import { getCourses } from "@/lib/actions/course.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseList from "./_components/CourseList";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

export default async function CoursesPage({ searchParams }: SearchPageProps) {
  const { userId } = auth();

  if (!userId) redirect("/");

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const subcategories = await db.subCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({ userId, ...searchParams });
  return (
    <div>
      <h1 className="font-bold text-2xl">Courses</h1>
      <div className="space-y-2 md:space-y-4">
        <div className="pt-6 sm:hidden sm:mb-0 block">
          <SearchInput />
        </div>
        <div>
          <Categories items={categories} />
        </div>
        <div>
          <CourseList items={courses} />
        </div>
      </div>
    </div>
  );
}
