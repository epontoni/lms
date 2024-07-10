"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";

export default function SearchInput() {
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debounceValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debounceValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-muted-foreground" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        type="search"
        placeholder="e.g. Differential calculus"
        className="w-full md:w-[300px] pl-9"
      />
    </div>
  );
}
