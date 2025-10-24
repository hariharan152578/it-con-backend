import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveFileLocally = (folder, file, fileName) => {
  try {
    const uploadDir = path.join(process.cwd(), "uploads", folder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`📁 Created folder: ${uploadDir}`);
    }

    const extension = path.extname(file.originalname);
    const fullFileName = `${fileName}${extension}`;
    const filePath = path.join(uploadDir, fullFileName);

    // ✅ Make sure file.buffer exists (requires memoryStorage)
    fs.writeFileSync(filePath, file.buffer);

    console.log(`✅ File saved at: ${filePath}`);

    return `/uploads/${folder}/${fullFileName}`;
  } catch (error) {
    console.error("❌ File Save Error:", error);
    throw new Error("File upload failed. Please try again.");
  }
};