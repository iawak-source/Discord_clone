"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import type { ClientUploadedFileData } from "uploadthing/types";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({
    onChange,
    value,
    endpoint,
}: FileUploadProps) => {
    const fileType = value?.split(".").pop();

    const handleUploadComplete = (
        res: ClientUploadedFileData<null>[] | undefined
    ) => {
        const uploadedUrl = res?.[0]?.url;
        console.log("[UploadThing] Upload result:", res);
        if (uploadedUrl) {
            onChange(uploadedUrl);
        }
    };

    const handleUploadError = (error: Error) => {
        console.error("[UploadThing] Upload failed:", error);
    };

    //  Nếu có ảnh đã upload → hiển thị
    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20 rounded-md overflow-hidden">
                <Image src={value} alt="Upload" fill className="object-cover" />
                <button
                    onClick={() => onChange("")}
                    type="button"
                    className="absolute top-0 right-0 bg-white text-black rounded-full p-1 shadow"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    if (value && fileType === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200
                stroke-indigo-400"/>
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {value}

                </a>
                <button
                    onClick={() => onChange("")}
                    type="button"
                    className="absolute top-0 right-0 bg-white text-black rounded-full p-1 shadow"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-4 w-full">
            {/* Dropzone Upload */}
            <UploadDropzone
                endpoint={endpoint}
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                className="border border-dashed rounded-lg p-4 w-full max-w-md mx-auto"
                appearance={{
                    container: "flex flex-col items-center gap-2",
                    label: "text-sm text-gray-500",
                    uploadIcon: "w-8 h-8 text-gray-400",
                    button: "hidden", // ẩn button trong dropzone
                }}
            />

            {/* Nút upload thủ công nếu cần */}
            <div className="flex justify-center">
                <UploadButton
                    endpoint={endpoint}
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    appearance={{
                        button:
                            "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded",
                        container: "w-full flex justify-center",
                    }}
                />
            </div>
        </div>
    );
};
