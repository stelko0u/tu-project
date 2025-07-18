const API_BASE_URL = "https://us-central1-car-project-5ba3d.cloudfunctions.net/api"

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");

admin.initializeApp();

const getUsers = async () => {
  const listUsersResult = await admin.auth().listUsers(1000);
  return listUsersResult.users.map((userRecord) => ({
    uid: userRecord.uid,
    email: userRecord.email,
    emailVerified: userRecord.emailVerified,
    phoneNumber: userRecord.phoneNumber,
    displayName: userRecord.displayName,
    disabled: userRecord.disabled,
    metadata: userRecord.metadata,
  }));
};

const deleteUser = async (uid) => {
  try {
    await admin.auth().deleteUser(uid);
    console.log(`Successfully deleted user with uid: ${uid}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error };
  }
};

const app = require("express")();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/getUsers", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

app.post("/deleteUser", async (req, res) => {
  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ success: false, error: "Missing uid" });
  }
  try {
    await admin.auth().deleteUser(uid);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

exports.api = functions.https.onRequest(app);
