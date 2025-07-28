export function getThumbnailPaths(photoUrl) {
  if (!photoUrl) return null;

  const pathMatch = photoUrl.match(/\/o\/(.+?)\?/);
  if (!pathMatch) return null;

  const decodedPath = decodeURIComponent(pathMatch[1]); // "cars/pic1.png"
  const parts = decodedPath.split("/"); // ["cars", "pic1.png"]
  if (parts.length < 2) return null;

  const fileName = parts[1]; // "pic1.png"
  const baseName = fileName.replace(/\.[^/.]+$/, ""); // "pic1"

  return {
    low: `/images/cars/thumbnails/${baseName}_400x225.webp`,
    high: `/images/cars/thumbnails/${baseName}_800x450.webp`,
  };
}
