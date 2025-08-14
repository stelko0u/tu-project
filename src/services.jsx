import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc, updateDoc, getDoc } from "firebase/firestore";
import { getUserFriendlyMessage } from "./Context/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const sendVerificationEmail = async (user) => {
  const auth = getAuth();
  try {
    await sendEmailVerification(user);
    return { success: true, message: "Verification email sent. Please check your inbox." };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
};

export const registerUser = async (email, password, name, phone, navigate) => {
  const auth = getAuth();
  const db = getFirestore();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name,
      phone,
      email,
    });

    await sendVerificationEmail(userCredential.user);

    navigate("/");

    return { success: true };
  } catch (error) {
    const errorMessage = getUserFriendlyMessage(error.code);
    return { success: false, error: errorMessage };
  }
};

export const loginUser = async (email, password, navigate) => {
  const auth = getAuth();
  try {
    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long." };
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    navigate("/");
    return { success: true };
  } catch (error) {
    const errorMessage = getUserFriendlyMessage(error.code);
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
    })
    .catch((error) => {
    });
};

export const addCar = async (carData, files, selectedStartYear, selectedFeatures, navigate) => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "No user is currently authenticated." };
    }

    const fileUploadPromises = files.map(async (file) => {
      const fileRef = ref(storage, `cars/${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    });
    const photoURLs = await Promise.all(fileUploadPromises);

    const newCar = {
      ...carData,
      year: selectedStartYear,
      features: selectedFeatures,
      photos: photoURLs,
      owner: user.email,
      views: 0,
    };

    const carsCollectionRef = collection(db, "cars");
    await addDoc(carsCollectionRef, newCar);
    console.log("Car added successfully:", newCar);

    navigate("/catalog");
    return { success: true };
  } catch (error) {
    console.error("Error adding car:", error);
    return { success: false, error: `Error adding car: ${error.message || "Unknown error"}` };
  }
};

export const editCar = async (
  carId,
  carData,
  files,
  selectedStartYear,
  selectedFeatures,
  navigate
) => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "No user is currently authenticated." };
    }

    const existingPhotos = files.filter((file) => typeof file === "string");
    const newFiles = files.filter((file) => typeof file !== "string");

    const fileUploadPromises = newFiles.map(async (file) => {
      const fileRef = ref(storage, `cars/${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    });
    const uploadedPhotoURLs = await Promise.all(fileUploadPromises);
    const allPhotos = [...existingPhotos, ...uploadedPhotoURLs];

    const updatedCar = {
      ...carData,
      year: selectedStartYear,
      features: selectedFeatures,
      photos: allPhotos,
      owner: user.email,
    };

    const carDocRef = doc(db, "cars", carId);
    await updateDoc(carDocRef, updatedCar);

    navigate("/catalog");
    return { success: true };
  } catch (error) {
    console.error("Error editing car:", error);
    return { success: false, error: `Error editing car: ${error.message || "Unknown error"}` };
  }
};
