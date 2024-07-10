import { GraduationCap, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-full w-full">
      <div className="animate-pulse">
        <GraduationCap className="text-primary w-20 h-20" />
        <p className="text-center flex items-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </p>
      </div>
    </div>
  );
}
