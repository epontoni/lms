"use client";

import { MENU_ITEMS, TEACHER_MENU_ITEMS } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function NavLinks() {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const ROUTES = isTeacherPage ? TEACHER_MENU_ITEMS : MENU_ITEMS;

  return (
    <nav className="flex gap-2  md:flex-col md:items-start items-center justify-center mx-auto md:m-0">
      {ROUTES.map((item, index) => (
        <Button
          key={index}
          asChild
          variant="ghost"
          className={cn(
            "md:h-full md:transition-all md:justify-start",
            pathname === item.href && "md:border-r-2 md:border-r-primary"
          )}
        >
          <Link
            key={index}
            href={item.href}
            className={`flex gap-2 transition-all duration-150 hover:bg-secondary md:w-full md:text-left md:rounded-none ${
              pathname === item.href && "text-primary bg-primary-foreground"
            }`}
          >
            <item.icon />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}
