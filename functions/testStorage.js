const { onObjectFinalized } = require("firebase-functions/v2/storage");

exports.testStorage = onObjectFinalized((object) => {
  console.log("File uploaded:", object.name);
  return null;
});