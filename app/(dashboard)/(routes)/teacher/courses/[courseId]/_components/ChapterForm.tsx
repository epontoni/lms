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
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import ChapterList from "./ChapterList";

interface ChapterFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export default function ChapterForm({
  initialData,
  courseId,
}: ChapterFormProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const toggleCreating = () => setIsCreating((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter created");
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // const onEdit = (id: string) => {
  //   router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  // };
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });
      toast.success("Chapters reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button
          variant="ghost"
          onClick={toggleCreating}
          className="hover:text-primary"
        >
          {isCreating && <>Cancel</>}
          {!isCreating && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" /> Add a chapter
            </>
          )}
        </Button>
      </div>
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && "text-slate-500 italic"
          )}
        >
          {!initialData.chapters.length && "No chapters"}
          <ChapterList
            // onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Introduction to diferential equations"
                    />
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
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
