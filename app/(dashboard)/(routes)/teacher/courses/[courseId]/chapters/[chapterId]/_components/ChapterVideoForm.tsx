"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Chapter, MuxData } from "@prisma/client";

import FileUpload from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";

interface ChapterVideoProps {
  initialData: Chapter & { muxData: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1, { message: "Video is required" }),
});

export default function ChapterVideo({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [resourceType, setResourceType] = useState<"upload" | "asset">("asset");

  const regexYTVideo = /youtu/;

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { videoUrl: initialData?.videoUrl || "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Video uploaded");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-secondary rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button
          variant="ghost"
          onClick={toggleEdit}
          className="hover:text-primary"
        >
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" /> Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-secondary-foreground rounded-md">
            <Video className="h-10 w-10 text-muted-foreground" />
          </div>
        ) : (
          <>
            {regexYTVideo.test(initialData?.videoUrl) && (
              <div className="relative pb-16/9">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={initialData?.videoUrl}
                  title="YouTube video"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            {!regexYTVideo.test(initialData?.videoUrl) &&
              !!initialData?.muxData && (
                <div className="relative aspect-video mt-2">
                  <MuxPlayer
                    playbackId={initialData?.muxData?.playbackId || ""}
                  />
                </div>
              )}
          </>
        ))}
      {isEditing && (
        <div className="flex items-center gap-2">
          <Switch
            checked={resourceType === "asset" ? true : false}
            onCheckedChange={() => {
              if (resourceType === "asset") {
                setResourceType("upload");
              } else {
                setResourceType("asset");
              }
            }}
          />
          {resourceType === "asset" && <p>Youtube URL</p>}
        </div>
      )}
      {isEditing && (
        <div>
          {resourceType === "upload" && (
            <>
              <FileUpload
                endpoint={"courseVideo"}
                onChange={(url) => {
                  if (url) {
                    onSubmit({ videoUrl: url });
                  }
                }}
              />
              <div className="text-xs text-muted-foreground mt-4">
                Upload this chapter's video
              </div>
            </>
          )}
          {resourceType === "asset" && (
            <>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 mt-4"
                >
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="videoUrl"
                            disabled={isSubmitting}
                            placeholder="e.g. https://www.youtube.com/embed/..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          <div className="text-xs text-muted-foreground mt-4">
                            Enter the link to the video. The URL{" "}
                            <strong>(https://www.youtube.com/embed/)</strong> is
                            important.
                          </div>
                        </FormDescription>
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
            </>
          )}
        </div>
      )}
      {initialData.videoUrl && resourceType === "upload" && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does nos appear.
        </div>
      )}
      {/* {initialData.videoUrl && resourceType === "asset" && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does nos appear.
        </div>
      )} */}
    </div>
  );
}
