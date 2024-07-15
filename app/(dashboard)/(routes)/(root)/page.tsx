// import SheetPage from "@/components/sheet-page";
// import { Button } from "@/components/ui/button";
// import { getDashboardCourses } from "@/lib/actions/dashboard-courses";
// import { useUser } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import { useState } from "react";
import { currentUser } from "@clerk/nextjs/server";
import CourseList from "../courses/_components/CourseList";
import { getDashboardCourses } from "@/lib/actions/dashboard-courses";
import InfoCard from "../../_components/InfoCard";
import { CheckCircle, Clock } from "lucide-react";
//import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  // const [open, setOpen] = useState<boolean>(false);
  // const { user } = useUser();

  const user = await currentUser();
  console.log("AUTH", user);
  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    user?.id!
  );

  // const openSheetpage = () => {
  //   setOpen((isOpen) => !isOpen);
  // };
  return (
    <main>
      <div className="border rounded-md flex items-center justify-center gap-2 bg-secondary p-5 md:p-10 font-bold md:text-xl">
        {" "}
        <span className="animate-hand-wave origin-hand-wave text-3xl md:text-5xl">
          👋{" "}
        </span>
        Hello, {user?.firstName}!
      </div>
      <h1 className="flex items-end gap-2 font-bold text-2xl my-3">
        My courses{" "}
        <span className="flex items-center justify-center rounded-full border p-2 w-[30px] h-[30px] text-sm">
          {completedCourses.length + coursesInProgress.length}
        </span>
      </h1>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard
            icon={Clock}
            label="In Progress"
            numberOfItems={coursesInProgress.length}
          />
          <InfoCard
            icon={CheckCircle}
            label="Completed"
            numberOfItems={completedCourses.length}
            variant="success"
          />
        </div>
        <CourseList items={[...coursesInProgress, ...completedCourses]} />
      </div>

      {/* <Button onClick={openSheetpage}>Open Sheetpage</Button>
      <SheetPage
        open={open}
        setOpen={setOpen}
        title="Esta es información extra"
        description="Esta es informaxión extra"
      /> */}
    </main>
  );
}
