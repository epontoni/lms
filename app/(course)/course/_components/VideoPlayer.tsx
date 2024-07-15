"use client";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId?: string | undefined;
  isLocked: boolean;
  completeOnEnd: boolean;
  videoUrl: string;
}
export default function VideoPlayer({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
  videoUrl,
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState<boolean>(false);
  const isYTVideo = /youtu/.test(videoUrl);
  const confetti = useConfettiStore();
  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          { isCompleted: true }
        );

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/course/${courseId}/chapter/${chapterId}`);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is lock</p>
        </div>
      )}

      {!isLocked && !isYTVideo && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}

      {!isLocked && isYTVideo && (
        <div className="relative pb-16/9">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={videoUrl}
            title="YouTube video"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}
