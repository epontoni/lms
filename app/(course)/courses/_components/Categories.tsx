"use client";

import { Category } from "@prisma/client";
import CategoryItem from "./CategoryItem";

interface CategoriesProps {
  items: Category[];
}
export default function Categories({ items }: CategoriesProps) {
  return (
    <div className="flex overflow-x-auto">
      {items.map((item) => {
        return <CategoryItem key={item.id} label={item.name} value={item.id} />;
      })}
    </div>
  );
}
