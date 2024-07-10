import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dispatch, SetStateAction } from "react";

export default function SheetPage({
  open,
  setOpen,
  title,
  description,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* <SheetTrigger>Open</SheetTrigger> */}
      <SheetContent className="w-full">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
