"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader, Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
});

export default function CreatePage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Course successfully created. Redirecting...");
        router.push(`/teacher/courses/${response.data.id}`);
      } else {
        toast.error("Something went wrong when creating a new course");
      }
    } catch (error) {
      toast.error("Something went wrong when creating a new course");
      console.log("Something went wrong when creating a new course", error);
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl text-primary">Create new course</h1>
      <div className="max-w-5xl mx-auto flex md:items-center md:justify-center md:h-[90%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8 w-full border rounded-md p-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 'Introduction to...'"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the name of the course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button asChild variant="ghost" type="button">
                <Link href="/">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
