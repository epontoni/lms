import { ModeToggle } from "@/components/mode-toggle";
import Logo from "@/app/(dashboard)/_components/Logo";
import Auth from "@/app/(dashboard)/_components/Auth";
import TeacherMode from "@/app/(dashboard)/_components/TeacherMode";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 h-[80px] border-b bg-background p-4">
      <div className="flex justify-between items-center h-full">
        <div>
          <div className="md:hidden">
            <Logo />
          </div>
        </div>

        <div className="flex gap-2 flex-1">
          <TeacherMode />
          <ModeToggle />
          <Auth />
        </div>
      </div>
    </header>
  );
}
