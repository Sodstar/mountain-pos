"use client";

import { useState } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onChange: (url?: string) => void;
  value?: string;
  endpoint: "userImageUploader";
}

export function FileUploader({ onChange, value, endpoint }: FileUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res:any) => {
      if (res && res[0]) {
        setPreview(res[0].url);
        onChange(res[0].url);
        setIsUploading(false);
      }
    },
    onUploadError: (error:any) => {
      console.error("Error uploading:", error);
      setIsUploading(false);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: generateClientDropzoneAccept(["image/*"]),
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        startUpload(acceptedFiles);
      }
    },
  });

  const removeImage = () => {
    setPreview(undefined);
    onChange(undefined);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-md"
          />
          <button
            type="button"
            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
            onClick={removeImage}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center text-sm h-32 w-full max-w-xs",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
          {isUploading ? (
            <p className="text-muted-foreground">Хуулж байна...</p>
          ) : (
            <p className="text-muted-foreground">
              Зураг оруулахын тулд энд дарна уу
            </p>
          )}
        </div>
      )}
    </div>
  );
}
