"use client";

import { Badge } from "@/components/ui/badge";
import { Category } from "@prisma/client";

interface CategoriesProps {
  items: Category[];
}
export default function Categories({ items }: CategoriesProps) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto py-2 md:py-0">
      {/* {items.map((item) => {
        return (
          <div>
            <Badge variant="outline" className="mb-2 hover:cursor-pointer">
              {item.name}
            </Badge>
          </div>
        );
      })} */}
    </div>
  );
}
