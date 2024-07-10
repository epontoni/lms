import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <GraduationCap className="size-7 transition-transform duration-300 transform hover:-rotate-12 hover:scale-110 hover:text-primary" />
      <h1 className="font-bold text-sm sm:text-xl">Learning</h1>
    </Link>
  );
}
