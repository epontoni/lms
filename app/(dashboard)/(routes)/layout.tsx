import type { Metadata } from "next";
import Sidebar from "@/app/(dashboard)/_components/Sidebar";
import Header from "@/app/(dashboard)/_components/Header";

export const metadata: Metadata = {
  title: "LMS | Dashboard",
  description: "Learning management system dashboard.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="grid h-screen w-full pb-[56px] md:pl-[150px] md:pb-0">
        <Sidebar />

        <div className="flex flex-col overflow-x-auto">
          <Header />

          <main className="h-full p-4 mb-[3rem] md:mb-0">{children}</main>
        </div>
      </div>
    </>
  );
}
