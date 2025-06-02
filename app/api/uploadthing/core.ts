import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

console.log("✅ UPLOADTHING_SECRET:", process.env.UPLOADTHING_SECRET);

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  console.log("[UploadThing] userId:", userId); // 👈 Log ra để kiểm tra

  if (!userId) {
    console.error("[UploadThing] ERROR: No userId found");
    throw new UploadThingError("Unauthorized");
  }

  return { userId };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(({ metadata, file }) => {
      console.log("✅ Upload complete:");
      console.log("File:", file);
      console.log("Metadata:", metadata);
    }),

  messageFile: f(["image", "pdf", "image/gif"])
    .middleware(handleAuth)
    .onUploadComplete(({ metadata, file }) => {
      console.log("✅ Upload complete:");
      console.log("File:", file);
      console.log("Metadata:", metadata);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
