const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = require("./service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "car-project-5ba3d.firebasestorage.app",
});

const bucket = admin.storage().bucket();

const downloadImages = async () => {
  const [files] = await bucket.getFiles({ prefix: "cars/" });

  for (const file of files) {
    if (file.name.endsWith("/")) continue;
    if (!/\.(jpg|jpeg|png)$/i.test(file.name)) continue;

    const fileName = path.basename(file.name);
    const destination = path.join(__dirname, "originals", fileName);

    await file.download({ destination });
    console.log(`⬇️  Downloaded: ${file.name} -> originals/${fileName}`);
  }
};

downloadImages()
  .then(() => console.log("✅ All files downloaded."))
  .catch((err) => console.error("❌ Error downloading files:", err));
