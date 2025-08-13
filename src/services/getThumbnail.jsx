
export default async function getThumbnailUrl(originalUrl) {
  if (!originalUrl) return null;

  const pathStart = "/o/";
  const pathIndex = originalUrl.indexOf(pathStart);
  if (pathIndex === -1) return originalUrl;

  const encodedPath = originalUrl.slice(pathIndex + pathStart.length);
  const decodedPath = decodeURIComponent(encodedPath.split("?")[0]);

  const parts = decodedPath.split("/");
  if (parts.length < 2) return originalUrl;

  const folder = parts[0];
  const originalFile = parts[1];
  const baseName = originalFile.replace(/\.[^/.]+$/, "");
  const thumbnailFileName = `${baseName}_200x200.webp`;
  const thumbnailPath = `${folder}/thumbnails/${thumbnailFileName}`;

  const bucket = "car-project-5ba3d.firebasestorage.app";
  const encodedThumbnail = encodeURIComponent(thumbnailPath);
  const thumbnailUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedThumbnail}?alt=media`;

  try {
    const res = await fetch(thumbnailUrl, { method: "HEAD" });
    if (res.ok) return thumbnailUrl;
    return originalUrl;
  } catch {
    return originalUrl;
  }
}
