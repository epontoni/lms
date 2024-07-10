"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1, { message: "URL resource is required" }),
});

export default function AttachmentForm({
  initialData,
  courseId,
}: AttachmentFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Resource uploaded");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Resource deleted");
      setDeletingId(null);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-secondary rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Attachments
        <Button
          variant="ghost"
          onClick={toggleEdit}
          className="hover:text-primary"
        >
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" /> Add a file
            </>
          )}
          {/* {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </>
          )} */}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-muted-foreground italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {" "}
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-500 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <Loader2 className="w-4 h-4 animate-spin ml-auto inline-block" />
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className="w-4 h-4 " />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* {!isEditing && (<>
      {initialData.attachments.length === 0 && (i)</>)} */}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students mught need to complete the course
          </div>
        </div>
      )}
    </div>
  );
}
