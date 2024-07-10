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
import {
  BadgeDollarSign,
  BadgeDollarSignIcon,
  DollarSign,
  Loader2,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";

import DOMPurify from "isomorphic-dompurify";
import RichText from "@/components/rich-text";
import { Course } from "@prisma/client";
import { Input } from "@/components/ui/input";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.string().min(1, { message: "Price is required" }),
});

export default function PriceForm({ initialData, courseId }: PriceFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { price: initialData?.price?.toString() || "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, {
        price: parseFloat(values.price),
      });
      toast.success("Price updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Price
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
        <p
          className={cn(
            "text-md flex items-center gap-1 p-3",
            !initialData.price && "text-slate-500 italic"
          )}
        >
          {(initialData.price && formatPrice(initialData.price)) ||
            "You have not yet added a Price"}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="$29" {...field} />
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
