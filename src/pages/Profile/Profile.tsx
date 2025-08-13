import React, { useState, useEffect, useContext } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import CarBox from "../../components/CarBox/CarBox";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  likes: string[];
}

interface UserProfile {
  name: string;
  phone: string;
  email: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  createdAt: any;
}

export default function Profile() {
  const { isAuthenticated } = useContext(AuthContext);
  const [likedCars, setLikedCars] = useState<Car[]>([]);
  const [myCars, setMyCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"ads" | "liked" | "settings" | "messages">("ads");
  const [newMessages, setNewMessages] = useState<number>(2);
  const [messages, setMessages] = useState<Message[]>([]);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLikedCars = async () => {
      if (!isAuthenticated) return;
      const userId = auth.currentUser?.uid;
      const carsRef = collection(db, "cars");
      const q = query(carsRef, where("likes", "array-contains", userId));
      try {
        const querySnapshot = await getDocs(q);
        const cars: Car[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Car[];
        setLikedCars(cars);
      } catch (error) {
        console.error("Error fetching liked cars:", error);
      }
    };

    const fetchMyCars = async () => {
      if (!isAuthenticated) return;
      const userId = auth.currentUser?.email;
      const carsRef = collection(db, "cars");
      const q = query(carsRef, where("owner", "==", userId));
      try {
        const querySnapshot = await getDocs(q);
        const cars: Car[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Car[];
        setMyCars(cars);
      } catch (error) {
        console.error("Error fetching my cars:", error);
      }
    };

    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setUserProfile(data);
          setEditName(data.name);
          setEditPhone(data.phone);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchMessages = async () => {
      if (!isAuthenticated) return;
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      try {
        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("to", "==", userId));
        const querySnapshot = await getDocs(q);
        const msgs: Message[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(msgs);
        setNewMessages(msgs.length);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    setLoading(true);
    Promise.all([fetchLikedCars(), fetchMyCars(), fetchUserProfile(), fetchMessages()]).finally(
      () => setLoading(false)
    );
  }, [isAuthenticated, auth, db]);

  const handleSendEmailVerification = async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      alert("Verification email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Failed to send verification email.");
    }
  };
  const handleEdit = () => {
    setEditMode(true);
    setError("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditName(userProfile?.name || "");
    setEditPhone(userProfile?.phone || "");
    setError("");
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    if (!editName.trim() || !editPhone.trim()) {
      setError("Name and phone number are required.");
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        name: editName,
        phone: editPhone,
      });
      setUserProfile((prev) => (prev ? { ...prev, name: editName, phone: editPhone } : prev));
      setEditMode(false);
      setError("");
    } catch (err) {
      setError("Failed to save changes.");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-3">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-xl text-gray-700 mb-4">You need to log in to view your profile.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Active Ads", value: myCars.length },
    { label: "Liked Cars", value: likedCars.length },
    { label: "New Messages", value: newMessages },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-blue-400 to-green-400 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center"
          >
            <span className="text-3xl font-bold text-white">{stat.value}</span>
            <span className="text-lg text-white mt-2">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 border-b">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "ads" ? "border-b-4 border-blue-500 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("ads")}
        >
          Your Ads
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "liked" ? "border-b-4 border-blue-500 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("liked")}
        >
          Liked Ads
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "settings" ? "border-b-4 border-blue-500 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 min-h-[180px]">
        {activeTab === "ads" && (
          <>
            <h2 className="text-xl font-bold mb-4">My Ads</h2>
            {myCars.length === 0 ? (
              <div className="text-gray-500">You have no active ads.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCars.map((car) => (
                  <CarBox key={car.id} car={car} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "liked" && (
          <>
            <h2 className="text-xl font-bold mb-4">Liked Cars</h2>
            {likedCars.length === 0 ? (
              <div className="text-gray-500">You haven't liked any cars yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedCars.map((car) => (
                  <CarBox key={car.id} car={car} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "settings" && (
          <>
            <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                  {userProfile?.name
                    ? userProfile.name.charAt(0).toUpperCase()
                    : auth.currentUser?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <div style={{ minHeight: "120px" }}>
                  {editMode ? (
                    <div className="flex flex-col gap-3">
                      <label className="font-semibold">Name:</label>
                      <input
                        className="border rounded p-2 mb-2"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={saving}
                      />
                      <label className="font-semibold">Phone number:</label>
                      <input
                        className="border rounded p-2 mb-2"
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        disabled={saving}
                      />
                      <label className="font-semibold">Email:</label>
                      <input
                        className="border rounded p-2 mb-2 bg-gray-100"
                        type="email"
                        value={userProfile?.email || auth.currentUser?.email || ""}
                        disabled
                      />

                      {error && <p className="text-red-500 font-bold mb-2">{error}</p>}
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div>
                        <span className="font-semibold">Name:</span>{" "}
                        <span>{userProfile?.name || "-"}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Phone number:</span>{" "}
                        <span>{userProfile?.phone || "-"}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span>{" "}
                        <span>{userProfile?.email || auth.currentUser?.email || "-"}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Email Verified:</span>{" "}
                        <span>{auth.currentUser?.emailVerified ? "Yes" : "No"}</span>
                      </div>
                      <button
                        onClick={handleEdit}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-fit"
                      >
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
              

              {!auth.currentUser?.emailVerified && (
                <button
                  onClick={handleSendEmailVerification}
                  className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition w-fit"
                >
                  Send Email Verification
                </button>
              )}

              {auth.currentUser?.email === "admin@admin.com" && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => navigate("/admin")}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition font-bold"
                  >
                    Go to Admin Panel
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
