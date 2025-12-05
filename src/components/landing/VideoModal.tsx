import { X } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

const VideoModal = ({ isOpen, onClose, videoUrl, title }: VideoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-background border-border overflow-hidden">
        <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 hover:bg-background transition-colors">
          <X className="h-5 w-5 text-foreground" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="aspect-video w-full">
          <iframe
            src={videoUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
