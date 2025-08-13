const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("❌ No input file path provided.");
  process.exit(1);
}

const baseName = path.basename(inputPath).replace(/\.[^/.]+$/, "");
const thumbnailsDir = path.join(__dirname, "public", "images", "cars", "thumbnails");

if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

const sizes = [
  { width: 400, height: 225, suffix: "_400x225" },
  { width: 800, height: 450, suffix: "_800x450" },
];

(async () => {
  try {
    for (const { width, height, suffix } of sizes) {
      const outputPath = path.join(thumbnailsDir, `${baseName}${suffix}.webp`);

      await sharp(inputPath).resize(width, height).webp({ quality: 80 }).toFile(outputPath);

      console.log(`✅ Created: ${outputPath}`);
    }
  } catch (err) {
    console.error("❌ Error generating thumbnails:", err);
    process.exit(1);
  }
})();
