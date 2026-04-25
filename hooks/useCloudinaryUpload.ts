"use client";

import { useState, useCallback } from "react";
import {
  cloudinaryConfig,
  CloudinaryUploadResult,
  CloudinaryError,
} from "@/lib/cloudinary";

interface UseCloudinaryUploadReturn {
  uploadImage: (file: File) => Promise<CloudinaryUploadResult>;
  isUploading: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (file: File): Promise<CloudinaryUploadResult> => {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryConfig.uploadPreset);
        formData.append("cloud_name", cloudinaryConfig.cloudName);
        formData.append("folder", "kognit");

        const xhr = new XMLHttpRequest();

        const uploadPromise = new Promise<CloudinaryUploadResult>(
          (resolve, reject) => {
            xhr.upload.addEventListener("progress", (event) => {
              if (event.lengthComputable) {
                const percentComplete = Math.round(
                  (event.loaded / event.total) * 100,
                );
                setProgress(percentComplete);
              }
            });

            xhr.addEventListener("load", () => {
              if (xhr.status === 200) {
                const response = JSON.parse(
                  xhr.responseText,
                ) as CloudinaryUploadResult;
                resolve(response);
              } else {
                const errorResponse = JSON.parse(
                  xhr.responseText,
                ) as CloudinaryError;
                reject(
                  new Error(errorResponse.error?.message || "Upload failed"),
                );
              }
            });

            xhr.addEventListener("error", () => {
              reject(new Error("Network error during upload"));
            });

            xhr.open(
              "POST",
              `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            );
            xhr.send(formData);
          },
        );

        const result = await uploadPromise;
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploadImage,
    isUploading,
    progress,
    error,
    reset,
  };
}
