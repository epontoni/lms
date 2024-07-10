"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  //chapterId: string;
  isPublished: boolean;
}

export default function CourseActions({
  disabled,
  courseId,
  //chapterId,
  isPublished,
}: CourseActionsProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course unpublished.");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course published.");
        confetti.onOpen();
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Course deleted.");
      router.refresh();
      router.push(`/teacher/courses/`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {!isLoading ? (
          <>{isPublished ? "Unpublish" : "Publish"}</>
        ) : (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isDeleting}>
          {!isDeleting ? (
            <Trash className="h-4 w-4" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
        </Button>
      </ConfirmModal>
    </div>
  );
}
