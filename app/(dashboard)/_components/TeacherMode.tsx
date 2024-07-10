"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TeacherMode() {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/courses");
  return (
    <div className="flex items-center">
      {isTeacherPage || isPlayerPage ? (
        <Button asChild variant="ghost">
          <Link href="/">
            <LogOut className="h-4 w-w4 mr-4" />
            Exit
          </Link>
        </Button>
      ) : (
        <Button asChild variant="ghost" size="sm">
          <Link href="/teacher/courses">Teacher mode</Link>
        </Button>
      )}
    </div>
  );
}
