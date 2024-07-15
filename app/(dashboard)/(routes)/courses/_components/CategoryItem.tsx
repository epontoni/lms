"use client";

import qs from "query-string";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CategoryItemProps {
  label: string;
  value: string;
}

export default function CategoryItem({ label, value }: CategoryItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-2"
        // TODO: Change style if active
      )}
      type="button"
    >
      <Badge
        variant={isSelected ? "default" : "outline"}
        className="transition"
      >
        {label}
      </Badge>
    </button>
  );
}
