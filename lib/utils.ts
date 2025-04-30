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
  currentImagePath: string
): Promise<{ fields: Fields; newImagePath: string }> {
  const contentType = req.headers.get("content-type") || "";

  // ✅ الحالة 1: لو الطلب JSON (تعديل بدون صورة)
  if (!contentType.includes("multipart/form-data")) {
    const body = await req.json();
    const fields = {
      name: [body.name],
      description: [body.description],
      safetyStatus: [body.safetyStatus],
      latitude: [body.latitude],
      longitude: [body.longitude],
    };
    return {
      fields,
      newImagePath: currentImagePath, // نحتفظ بالصورة القديمة
    };
  }

  // ✅ الحالة 2: لو الطلب فيه صورة (multipart/form-data)
  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: false,
  });

  const buffer = Buffer.from(await req.arrayBuffer());
  const stream = new PassThrough();
  stream.end(buffer);

  const fakeReq = Object.assign(stream, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url ?? "/",
  }) as unknown as IncomingMessage;

  return new Promise((resolve, reject) => {
    form.parse(fakeReq, (err, fields, files) => {
      if (err) return reject(err);

      let newImagePath = currentImagePath;

      const file = files.image as File | File[] | undefined;
      const imageFile = Array.isArray(file) ? file[0] : file;

      if (imageFile && imageFile.filepath) {
        // ✅ إذا فيه صورة جديدة مرفوعة:
        deleteImage(currentImagePath); // حذف الصورة القديمة
        newImagePath = "/uploads/" + path.basename(imageFile.filepath);
      }

      resolve({ fields, newImagePath });
    });
  });
}
