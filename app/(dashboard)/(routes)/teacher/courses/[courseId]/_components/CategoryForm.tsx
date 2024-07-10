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
import { startTransition, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: {
    label: string;
    value: string;
    subCategories: { label: string; value: string }[];
  }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
  subCategoryId: z.string().min(1, { message: "Subcategory is required" }),
});

export default function CategoryForm({
  initialData,
  courseId,
  options,
}: CategoryFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const [newSubCategory, setNewSubcategory] = useState<string>("");

  const handleAddCategory = async () => {
    try {
      await axios.post(`/api/courses/categories`, { newCategory });
      toast.success("Category created");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleAddSubcategory = async () => {
    try {
      await axios.post(`/api/courses/subcategories`, {
        newSubCategory,
        categotyId: form.watch("categoryId"),
      });
      toast.success("Subcategory created");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
      subCategoryId: initialData?.subCategoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const selectedOption = options?.find(
    (option) => option.value === initialData.categoryId
  );

  const selectedSubOption = options
    .find((category) => category.value === initialData.categoryId)
    ?.subCategories.find(
      (subCat) => subCat.value === initialData.subCategoryId
    );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course category
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
            "text-sm mt-2",
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {`${selectedOption?.label || "No cateogry assigned"}  > ${
            selectedSubOption?.label || "No subcategory assigned"
          }`}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="flex flex-col sm:flex-row md:flex-col xl:flex-row gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <Label>Category</Label>
                    <FormControl>
                      <Combobox options={options} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <Button variant="link" className="flex gap-2 self-end" onClick={() =>}>
                <PlusCircle className="w-4 h-4" />
                Add new category
              </Button> */}

              {/* --------------------------------- */}
              <AlertDialog>
                <AlertDialogTrigger className="flex w-full gap-2 items-center justify-end text-sm text-primary hover:text-foreground">
                  <PlusCircle className="w-4 h-4" />
                  Add new category
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Name of the new category
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <Input
                        type="text"
                        placeholder="e.g. Computational thinking"
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => startTransition(handleAddCategory)}
                    >
                      Add
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* --------------------------------- */}

              <FormField
                control={form.control}
                name="subCategoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <Label>
                      Subcategory{" "}
                      <span className="text-xs text-muted-foreground">
                        (Pre-select a category)
                      </span>
                    </Label>
                    <FormControl>
                      <Combobox
                        options={
                          options.find(
                            (category) =>
                              category.value === form.watch("categoryId")
                          )?.subCategories || []
                        }
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* --------------------------------- */}
              <AlertDialog>
                <AlertDialogTrigger
                  className="flex w-full gap-2 items-center justify-end text-sm text-primary hover:text-foreground"
                  disabled={!form.watch("categoryId")}
                >
                  <PlusCircle className="w-4 h-4" />
                  Add new subcategory
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Name of the new subcategory
                    </AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col gap-2">
                      <Label>
                        Subcategory of:{" "}
                        <strong>
                          {
                            options?.filter(
                              (option) =>
                                option.value === form.watch("categoryId")
                            )[0]?.label
                          }
                        </strong>
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. Computational thinking"
                        onChange={(e) => setNewSubcategory(e.target.value)}
                      />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => startTransition(handleAddSubcategory)}
                    >
                      Add
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* --------------------------------- */}
            </div>

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
