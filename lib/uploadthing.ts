import {
  generateUploadDropzone,
  generateUploadButton,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

// ✅ Export Dropzone
export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: "/api/uploadthing",
});

// ✅ Export Button
export const UploadButton = generateUploadButton<OurFileRouter>({
  url: "/api/uploadthing",
});
