// import { IncomingForm, Fields, Files, File } from "formidable";
// import path from "path";
// import * as fsSync from "fs";
// import { NextRequest } from "next/server";
// import { IncomingMessage } from "http";
// import { Socket } from "net";

// // تأكد من أن مجلد الرفع موجود
// // const uploadDir = path.join(process.cwd(), "/public/uploads");

// // Add img to public/uploads folder and return the path
// import { Readable } from "stream";

// // تحويل NextRequest إلى Stream يمكن استخدامه مع formidable
// function nextRequestToReadable(req: Request): Readable {
//   const reader = req.body?.getReader();
//   const stream = new Readable({
//     async read() {
//       if (!reader) return this.push(null);

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) {
//           this.push(null);
//           break;
//         }
//         this.push(value);
//       }
//     },
//   });

//   return stream;
// }

// export async function handleImageUpload(
//   req: Request
// ): Promise<{ fields: Fields; imagePath: string } | undefined> {
//   const uploadDir = path.join(process.cwd(), "/public/uploads");

//   if (!fsSync.existsSync(uploadDir)) {
//     fsSync.mkdirSync(uploadDir, { recursive: true });
//   }

//   const form = new IncomingForm({
//     uploadDir,
//     keepExtensions: true,
//     multiples: false,
//   });

//   const stream = nextRequestToReadable(req);

//   const mockSocket = new Socket();
//   const incomingMessage = Object.assign(new IncomingMessage(mockSocket), {
//     headers: req.headers,
//     method: req.method,
//     url: req.url,
//   });
//   (incomingMessage as unknown as IncomingMessage & { body: Readable }).body =
//     stream;

//   const [fields, files]: [Fields, Files] = await new Promise(
//     (resolve, reject) => {
//       form.parse(incomingMessage, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve([fields, files]);
//       });
//     }
//   );

//   const imageFile = files.image as File[];
//   if (!imageFile || imageFile.length === 0) {
//     throw new Error("Image is required");
//   }

//   const imagePath =
//     "/uploads/" + path.basename(imageFile[0].filepath as string);
//   return { fields, imagePath };
// }

// // Delete image from public/uploads folder
// export async function deleteImage(imagePath: string) {
//   try {
//     const fullPath = path.join(process.cwd(), "public", imagePath);
//     await fs.unlink(fullPath);
//   } catch (err) {
//     console.warn("Image not found or already deleted:", err);
//   }
// }

// // Update image (delete old one and upload new one)
// export async function updateImage(
//   req: NextRequest,
//   oldImagePath: string
// ): Promise<{ fields: Fields; newImagePath: string }> {
//   const uploadResult = await handleImageUpload(req);
//   if (!uploadResult) {
//     throw new Error("Failed to upload image");
//   }
//   const { fields, imagePath: newImagePath } = uploadResult;
//   await deleteImage(oldImagePath);
//   return { fields, newImagePath };
// }

// export function isAdmin(user: { role: string }): boolean {
//   return user.role === "admin";
// }

// export function isUser(user: { role: string }): boolean {
//   return user.role === "user";
// }
import { IncomingForm, Fields, File } from "formidable";
import path from "path";
import fsSync from "fs";
import fs from "fs/promises";
import { PassThrough } from "stream";
import { IncomingMessage } from "http";

// تأكد من وجود مجلد الرفع
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fsSync.existsSync(uploadDir)) {
  fsSync.mkdirSync(uploadDir, { recursive: true });
}

export async function handleImageUpload(
  req: Request
): Promise<{ fields: Fields; imagePath: string }> {
  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: false,
  });

  // اقرأ الجسم كـ Buffer
  const buffer = Buffer.from(await req.arrayBuffer());
  const stream = new PassThrough();
  stream.end(buffer);

  // صنع كائن يشبه IncomingMessage
  const fakeReq = Object.assign(stream, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url ?? "/",
  }) as unknown as IncomingMessage;

  return new Promise((resolve, reject) => {
    form.parse(fakeReq, (err, fields, files) => {
      if (err) return reject(err);

      const file = files.image as File | File[];
      const imageFile = Array.isArray(file) ? file[0] : file;
      if (!imageFile || !imageFile.filepath) {
        return reject(new Error("No image uploaded"));
      }

      const imagePath = "/uploads/" + path.basename(imageFile.filepath);
      resolve({ fields, imagePath });
    });
  });
}

export async function deleteImage(imagePath: string) {
  try {
    const fullPath = path.join(process.cwd(), "public", imagePath);
    await fs.unlink(fullPath);
    console.log("Image deleted:", fullPath);
  } catch (err) {
    console.warn("Image not found or already deleted:", err);
  }
}

export async function updateImage(
  req: Request,
  oldImagePath: string
): Promise<{ fields: Fields; newImagePath: string }> {
  const uploadResult = await handleImageUpload(req);
  if (!uploadResult) {
    throw new Error("Failed to upload new image");
  }

  const { fields, imagePath: newImagePath } = uploadResult;

  // حذف الصورة القديمة
  await deleteImage(oldImagePath);

  return { fields, newImagePath };
}