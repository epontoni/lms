import { db } from "@/lib/db";
import Categories from "./_components/Categories";

export default async function CoursesPage() {
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
  return (
    <div>
      <h1 className="font-bold text-2xl">Courses</h1>
      <div className="md:p-6">
        <Categories items={categories} />
      </div>
    </div>
  );
}
