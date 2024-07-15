import { isTeacher } from "@/lib/actions/teacher.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  if (!isTeacher(userId)) return redirect("/");
  return <>{children}</>;
}
