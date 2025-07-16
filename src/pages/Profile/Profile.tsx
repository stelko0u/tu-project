import React, { useState, useEffect, useContext } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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

export default function Profile() {
  const { isAuthenticated } = useContext(AuthContext);
  const [likedCars, setLikedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedCars = async () => {
      if (!isAuthenticated) {
        return;
      }

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
      } finally {
        setLoading(false);
      }
    };

    fetchLikedCars();
  }, [isAuthenticated, auth, db]);

  if (loading) {
    return <div className="p-3">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>You need to log in to view your liked cars.</p>
      </div>
    );
  }

  if (likedCars.length === 0) {
    return <div className="p-3 text-xl">You haven't liked any cars yet.</div>;
  }

  return (
    <div className="p-4">
      {auth.currentUser?.email === "admin@admin.com" && (
        <div className="p-4">
          <button
            onClick={() => navigate("/admin")}
            style={{ backgroundColor: "rgb(22, 143, 122)" }}
            className="text-white px-4 py-2 rounded hover:opacity-90 transition"
          >
            Go to Admin Page
          </button>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Your Liked Cars</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {likedCars.map((car) => (
          <CarBox key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
