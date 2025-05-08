import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  // Define as many file routes as you need
  userImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),

  // Add this new endpoint for product images
  productImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
