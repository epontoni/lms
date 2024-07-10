import { BarChart, Book, Home, List, Settings, Sparkles } from "lucide-react";

export const COLOR_SCHEMES = [
  "theme-zinc",
  "theme-slate",
  "theme-stone",
  "theme-gray",
  "theme-neutral",
  "theme-red",
  "theme-rose",
  "theme-orange",
  "theme-green",
  "theme-blue",
  "theme-yellow",
  "theme-violet",
];

export const MENU_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/courses",
    label: "Courses",
    icon: Book,
  },
  {
    href: "/more",
    label: "More",
    icon: Sparkles,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export const TEACHER_MENU_ITEMS = [
  {
    href: "/teacher/courses",
    label: "Courses",
    icon: List,
  },
  {
    href: "/teacher/analytics",
    label: "Analytics",
    icon: BarChart,
  },
];
