"use client";
import SheetPage from "@/components/sheet-page";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function DashboardPage() {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useUser();

  const openSheetpage = () => {
    setOpen((isOpen) => !isOpen);
  };
  return (
    <main>
      <div className="border rounded-md flex items-center justify-center gap-2 bg-gray-100 p-5 md:p-10 font-bold md:text-xl">
        {" "}
        <span className="animate-hand-wave origin-hand-wave text-3xl md:text-5xl">
          👋
        </span>{" "}
        Hello, {user?.firstName}!
      </div>
      <h1 className="flex items-end gap-2 font-bold text-2xl my-3">
        My courses{" "}
        <span className="flex items-center justify-center rounded-full border p-2 w-[30px] h-[30px] text-sm">
          3
        </span>
      </h1>
      <Button onClick={openSheetpage}>Open Sheetpage</Button>
      <SheetPage
        open={open}
        setOpen={setOpen}
        title="Esta es información extra"
        description=" Esta es informaxión extra"
      />
    </main>
  );
}
