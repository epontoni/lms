"use client";

import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { Chapter } from "@prisma/client";

interface Item {
  chapter: Chapter;
}

export default function Sortable({ chapter }: Item) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: chapter.position,
    });

  const router = useRouter();

  // const editPath =
  //   type === "Unit"
  //     ? `/dashboard/edit/${courseId}/curriculum/${item._id}`
  //     : `/dashboard/edit/${courseId}/curriculum/${unitId}/lessons/${item._id}`;

  const editPath = `/teacher/courses/${chapter.courseId}/chapters/${chapter.id}`;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 border p-2 m-2 bg-background rounded-lg hover:bg-secondary/50"
    >
      <GripVertical />
      {chapter.title}
      <div className="flex items-center gap-4 ml-auto">
        <Badge
          className="ml-auto hover:bg-muted-foreground"
          variant={chapter.isPublished ? "default" : "secondary"}
        >
          {chapter.isFree ? "Free" : "🔒"}
        </Badge>

        <Badge
          className="ml-auto hover:bg-muted-foreground"
          variant={chapter.isPublished ? "default" : "secondary"}
        >
          {chapter.isPublished ? "Published" : "Unpublished"}
        </Badge>

        <Button asChild variant="ghost">
          <Link href={editPath}>
            <Pencil className="ml-auto h-4 w-4 hover:text-primary" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
