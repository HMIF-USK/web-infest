"use client";

import toast from "react-hot-toast";
import { UploadDropzone } from "@/utils/uploadthing/uploadthing";

interface ImageUploadProps {
    onChange: (url: string) => void;
    className?: string;
}

export const ImageUpload = (props: ImageUploadProps) => {
  return (
    <UploadDropzone
      className={`h-full w-full relative bg-transparent border-dashed border-white/30 gap-0 text-xs duration-200 hover:bg-white/5 cursor-pointer rounded-xl ${props.className}`}
      appearance={{
        label: "text-xs text-main_bg hover:text-main_bg/80 duration-200",
        uploadIcon: "text-main_bg hover:text-main_bg/80 duration-200",
        button: "bg-primary/80 text-main_bg shadow-md shadow-black active:outline-none focus:outline-none active:ring-0 focus:ring-0 ut-uploading:after:bg-secondary ut-uploading:text-main_bg"
      }}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log(res?.[0].url);
        props.onChange(res?.[0].url);
        toast.success(`Berhasil mengunggah gambar`);
      }}
      onUploadError={(error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};
