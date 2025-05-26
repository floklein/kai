import { X } from "lucide-react";
import { PhotoView } from "react-photo-view";
import { Button } from "./ui/button";

export function ImagePreview({
  image,
  onDelete,
}: {
  image: Blob;
  onDelete: () => void;
}) {
  const imageUrl = URL.createObjectURL(image);

  return (
    <div className="relative">
      <PhotoView src={imageUrl}>
        <img
          src={imageUrl}
          alt="Image preview"
          className="h-20 w-20 object-cover rounded-lg"
        />
      </PhotoView>
      <Button
        variant="secondary"
        size="icon"
        onClick={onDelete}
        className="absolute top-1 right-1 h-6 w-6"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
