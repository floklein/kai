import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AudioLines } from "lucide-react";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";

const RECORDING_MAX_DURATION = 240; // 4 minutes in seconds

export function RecordButton({
  onRecord,
  className,
}: {
  onRecord: (blob: Blob) => void;
  className?: string;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordingTime, setRecordingTime] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!audioStream) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setAudioStream(stream);
          const mediaRecorder = new MediaRecorder(stream);
          setMediaRecorder(mediaRecorder);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [audioStream]);

  useEffect(() => {
    if (mediaRecorder) {
      let audio: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audio = [event.data];
        }
      };
      mediaRecorder.onstop = () => {
        const b = new Blob(audio, { type: "audio/wav" });
        onRecord(b);
      };
    }
  }, [mediaRecorder, onRecord]);

  function handleToggleRecording(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  function startRecording() {
    if (!mediaRecorder) {
      return;
    }
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prevTime) => {
        if (prevTime >= RECORDING_MAX_DURATION - 1) {
          stopRecording();
          return RECORDING_MAX_DURATION;
        }
        return prevTime + 1;
      });
    }, 1000);
  }

  function stopRecording() {
    if (!mediaRecorder) {
      return;
    }
    mediaRecorder.stop();
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }

  const time = useMemo(() => {
    const minutes = Math.floor(recordingTime / 60);
    const remainingSeconds = recordingTime % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, [recordingTime]);

  return (
    <div className={cn(className, "flex items-center gap-2")}>
      {isRecording && <span>{time}</span>}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "default"}
            onClick={handleToggleRecording}
            className="rounded-full"
          >
            <AudioLines />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Use voice to send a message</TooltipContent>
      </Tooltip>
    </div>
  );
}
