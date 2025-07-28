import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase";

import Modal from "react-modal";
import DeleteCarModal from "../../Modals/AdminModals/DeleteCarModals";
import DeleteMessageModal from "../../Modals/AdminModals/DeleteMessageModal";

import UsersList from "../../components/UsersList/UsersList";
import CarsList from "../../components/CarList/CarList";
import MessagesList from "../../components/MessagesList/MessagesList";

import { fetchUsers } from "./manageUsers";
Modal.setAppElement("#root");

const API_BASE_URL = "https://us-central1-car-project-5ba3d.cloudfunctions.net/api";

export default function AdminPage() {
  const [cars, setCars] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState(null);

  const [isDeleteCarModalOpen, setIsDeleteCarModalOpen] = useState(false);
  const [carToDeleteId, setCarToDeleteId] = useState(null);

  const [isDeleteMessageModalOpen, setIsDeleteMessageModalOpen] = useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null);

  const navigate = useNavigate();
  let db;

  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn("Firebase already initialized:", e);
  }

  useEffect(() => {
    const loadUsers = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };
    loadUsers();
  }, []);

  const handleUsersClick = async () => {
    setCurrentView("users");
    setLoading(true);
    setError(null);
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCarsClick = async () => {
    setCurrentView("cars");
    setLoading(true);
    setError(null);
    try {
      const carsSnapshot = await getDocs(collection(db, "cars"));
      const data = carsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(data);
    } catch (err) {
      setError(err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMessagesClick = async () => {
    setCurrentView("messages");
    setLoading(true);
    setError(null);
    try {
      const messagesSnapshot = await getDocs(collection(db, "contacts"));
      const data = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    } catch (err) {
      setError(err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteCarModal = (id) => {
    setCarToDeleteId(id);
    setIsDeleteCarModalOpen(true);
  };

  const closeDeleteCarModal = () => {
    setCarToDeleteId(null);
    setIsDeleteCarModalOpen(false);
  };

  const openDeleteMessageModal = (id) => {
    setMessageToDeleteId(id);
    setIsDeleteMessageModalOpen(true);
  };

  const closeDeleteMessageModal = () => {
    setMessageToDeleteId(null);
    setIsDeleteMessageModalOpen(false);
  };

  const handleDeleteCar = async () => {
    if (!carToDeleteId) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "cars", carToDeleteId));
      await handleCarsClick(); // refresh
    } catch (err) {
      setError(err);
    } finally {
      closeDeleteCarModal();
      setLoading(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDeleteId) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "contacts", messageToDeleteId));
      await handleMessagesClick(); // refresh
    } catch (err) {
      setError(err);
    } finally {
      closeDeleteMessageModal();
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!uid) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/deleteUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();
      if (data.success) {
        await handleUsersClick();
      } else {
        throw new Error(data.error?.message || "User deletion failed");
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-white text-center mt-8">Loading data...</div>;
    if (error) return <div className="text-red-400 text-center mt-8">Error: {error.message}</div>;

    switch (currentView) {
      case "users":
        return <UsersList users={users} onDeleteUser={handleDeleteUser} />;
      case "cars":
        return <CarsList cars={cars} onDelete={openDeleteCarModal} />;
      case "messages":
        return <MessagesList messages={messages} onDelete={openDeleteMessageModal} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#212121]">
      <aside className="w-full lg:w-64 bg-[#19191F] text-white p-4 flex flex-col">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">Admin Menu</h2>
        </div>

        <nav className="space-y-2 flex-grow">
          <button
            onClick={handleUsersClick}
            className="block w-full text-left p-2 rounded hover:bg-gray-700"
            disabled={loading}
          >
            List Users
          </button>
          <button
            className={`block w-full text-left p-2 rounded ${
              currentView === "cars" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={handleCarsClick}
            disabled={loading}
          >
            Cars
          </button>
          <button
            className={`block w-full text-left p-2 rounded ${
              currentView === "messages" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={handleMessagesClick}
            disabled={loading}
          >
            Messages
          </button>
        </nav>
        <Link
          to="/profile"
          className="block w-full text-left p-2 hover:bg-gray-700 rounded mt-auto text-center border-t border-gray-700 pt-4"
        >
          Exit Admin
        </Link>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Welcome to Admin Panel</h1>
        {renderContent()}
      </main>

      {/* Модали */}
      <DeleteCarModal
        isOpen={isDeleteCarModalOpen}
        onRequestClose={closeDeleteCarModal}
        onDelete={handleDeleteCar}
      />

      <DeleteMessageModal
        isOpen={isDeleteMessageModalOpen}
        onRequestClose={closeDeleteMessageModal}
        onDelete={handleDeleteMessage}
      />
    </div>
  );
}
