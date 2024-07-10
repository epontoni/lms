import { GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LMS | Authentication",
  description: "Log in or create an account in the learning management system.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col md:flex-row items-center justify-center gap-10 h-screen bg-primary-foreground">
      <div className="flex flex-col items-center">
        <Link href="/">
          <GraduationCap className="w-20 h-20 hover:-rotate-12 hover:text-primary transition-all duration-100" />
        </Link>
        <h1 className="font-bold text-primary text-2xl">LMS</h1>
        <h2 className="text-lg">Learning Management System</h2>
      </div>
      {children}
    </main>
  );
}
