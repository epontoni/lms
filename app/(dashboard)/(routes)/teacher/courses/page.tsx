import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";
import { CoursesTable } from "./_components/CoursesTable";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const { userId } = auth();

  if (!userId) redirect("/");

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-bold text-2xl">Courses</h1>
      </div>

      <CoursesTable columns={columns} data={courses} />
    </div>
  );
}
