"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { Switch } from "@/components/ui/switch";

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

export default function ChapterAccessForm({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFree: Boolean(initialData?.isFree) || false },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter title updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter access
        <Button
          variant="ghost"
          onClick={toggleEdit}
          className="hover:text-primary"
        >
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2 text-slate-700 italic">
          {initialData.isFree ? (
            <>🆓 This chapter is free for preview</>
          ) : (
            <> 🔒 This chapter is not free</>
          )}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <p
                        className={
                          !!form.watch("isFree")
                            ? "text-primary font-bold"
                            : "text-slate-700"
                        }
                      >
                        {!!form.watch("isFree") ? "Free" : "Not free"}
                      </p>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
