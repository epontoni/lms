"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Sortable from "@/components/Sortable";

interface ChapterListProps {
  //onEdit: (id: string) => void;
  onReorder: (updateData: { id: string; position: number }[]) => void;
  items: Chapter[];
}

export default function ChapterList({
  //onEdit,
  onReorder,
  items,
}: ChapterListProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [chapters, setChapters] = useState<Chapter[]>(items);

  useEffect(() => {
    setIsMounted(true);
    console.log("chapters: ", chapters);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    /*
     la propiedad position debería tomarse del chapter.position, pero arrayMove no cambia su valor,
     solo mueve los elementos del array.
    */
    const bulkUpdateData = chapters.map((chapter, index) => {
      return { id: chapter.id, position: index + 1 };
    });
    // Save to database
    onReorder(bulkUpdateData); // OJO, preparar de la forma {id: string, position: number}[]
  }, [chapters]);

  if (!isMounted) {
    return null;
  }

  const handleDragEnd = async (event: { active: any; over: any }) => {
    const { active, over } = event;

    // Si los índices no cambiaron, salir.
    if (active.id === over.id) return;

    setChapters((prevItems) => {
      const oldIndex = prevItems.findIndex(
        (item) => item.position === active.id
      );
      const newIndex = prevItems.findIndex((item) => item.position === over.id);

      return arrayMove(prevItems, oldIndex, newIndex);
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={chapters.map((chapter) => chapter.position)}
        strategy={verticalListSortingStrategy}
      >
        {chapters?.map((chapter, index) => (
          <Sortable key={chapter.position} chapter={chapter} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
