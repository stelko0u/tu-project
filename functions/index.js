const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");
const path = require("path");
const os = require("os");
const fs = require("fs");

admin.initializeApp();
const gcs = new Storage();

exports.generateThumbnails = functions.storage.object().onFinalize(async (object) => {
  const bucket = gcs.bucket(object.bucket);
  const filePath = object.name;
  const contentType = object.contentType;

  if (!contentType.startsWith("image/")) return null;
  if (filePath.includes("thumbnails/")) return null; // вече е thumbnail

  const fileName = path.basename(filePath);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  // Изтегляне на оригинала
  await bucket.file(filePath).download({ destination: tempFilePath });

  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const folder = path.dirname(filePath);

  // Размери
  const sizes = [
    { width: 400, height: 225, suffix: "_400x225" },
    { width: 800, height: 450, suffix: "_800x450" },
  ];

  const uploadPromises = sizes.map(async ({ width, height, suffix }) => {
    const thumbFileName = `${baseName}${suffix}.webp`;
    const thumbPath = path.join(os.tmpdir(), thumbFileName);

    await sharp(tempFilePath)
      .resize(width, height)
      .webp({ quality: 80 })
      .toFile(thumbPath);

    const destination = `${folder}/thumbnails/${thumbFileName}`;
    return bucket.upload(thumbPath, {
      destination,
      metadata: {
        contentType: "image/webp",
      },
    });
  });

  await Promise.all(uploadPromises);
  fs.unlinkSync(tempFilePath); // изтрий оригинала от temp
  return null;
});
