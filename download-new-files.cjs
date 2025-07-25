// // download-new-files.js
// const admin = require("firebase-admin");
// const { Storage } = require("@google-cloud/storage");
// const fs = require("fs");
// const path = require("path");

// const localFolder = path.join(__dirname, "originals");
// const bucketName = "car-project-5ba3d.firebasestorage.app";
// const remoteFolder = "cars/";

// if (!fs.existsSync(localFolder)) {
//   fs.mkdirSync(localFolder);
// }

// // Init Firebase
// // admin.initializeApp({
// //   credential: admin.credential.cert(require("./service-account-key.json")),
// //   storageBucket: bucketName,
// // });
// process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, "service-account-key.json");

// const storage = new Storage();
// const bucket = storage.bucket(bucketName);

// async function downloadNewFiles() {
//   const [files] = await bucket.getFiles({ prefix: remoteFolder });

//   for (const file of files) {
//     const fileName = path.basename(file.name);
//     const localPath = path.join(localFolder, fileName);

//     if (fileName.includes("thumbnails/")) continue;
//     if (!fileName.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

//     if (!fs.existsSync(localPath)) {
//       console.log(`⬇️  Downloading ${file.name}...`);
//       await file.download({ destination: localPath });
//       console.log(`✅ Saved to ${localPath}`);
//     }
//   }
// }

// (async () => {
//   console.log("🚀 Watching Firebase Storage...");
//   await downloadNewFiles();

//   // Повтаря на всеки 60 секунди
//   setInterval(downloadNewFiles, 60000);
// })();

// download-new-files.js
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// Път до service account
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, "service-account-key.json");

const localFolder = path.join(__dirname, "originals");
const bucketName = "car-project-5ba3d.firebasestorage.app";
const remoteFolder = "cars/";

if (!fs.existsSync(localFolder)) {
  fs.mkdirSync(localFolder);
}

const storage = new Storage();
const bucket = storage.bucket(bucketName);

async function downloadNewFiles() {
  const [files] = await bucket.getFiles({ prefix: remoteFolder });

  for (const file of files) {
    const fileName = path.basename(file.name);
    const localPath = path.join(localFolder, fileName);

    if (file.name.includes("thumbnails/")) continue;
    if (!fileName.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

    if (!fs.existsSync(localPath)) {
      console.log(`⬇️  Downloading ${file.name}...`);
      await file.download({ destination: localPath });
      console.log(`✅ Saved to ${localPath}`);

      const gen = spawn("node", ["generate-thumbnails.cjs", localPath], {
        stdio: "inherit",
      });

      gen.on("exit", (code) => {
        if (code === 0) {
          console.log("🖼️ Thumbnails created.");
        } else {
          console.error(`❌ Thumbnail generation failed for ${fileName} with code ${code}`);
        }
      });
    }
  }
}

(async () => {
  console.log("🚀 Watching Firebase Storage...");
  await downloadNewFiles();
  setInterval(downloadNewFiles, 60 * 1000); // на всеки 60 секунди
})();
