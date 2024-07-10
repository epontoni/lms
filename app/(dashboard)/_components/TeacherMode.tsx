"use client";

import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { LogOut, Presentation } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TeacherMode() {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/courses");
  // const isSearchPage = pathname === "/search"
  return (
    <>
      <div className="w-full flex-1 flex items-center">
        {isPlayerPage && (
          <div className="hidden sm:flex flex-1 w-full justify-center">
            <SearchInput />
          </div>
        )}
      </div>
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
            <Link href="/teacher/courses" className="flex gap-2 items-center">
              <Presentation />
              <span className="hidden sm:inline">Teacher mode</span>
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}
