import Logo from "./Logo";
import NavLinks from "@/components/NavLinks";

export default function Sidebar() {
  return (
    <div className="bg-background inset-x bottom-0 border-t w-screen md:inset-y md:left-0 fixed z-20 flex h-[57px] md:h-full md:flex-col md:border-r md:w-auto">
      <div className="md:h-[76px] px-4 py-3 md:flex md:items-center hidden">
        <Logo />
      </div>

      <NavLinks />
    </div>
  );
}
