import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, deleteDoc, increment, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Heart, PencilLine, Trash2 } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Modal from "react-modal";
import Chat from "../../components/Chat/ChatComponent.jsx";
import { getThumbnailPaths } from "../../utils/getThumbnailPaths";

Modal.setAppElement("#root");

export default function Details() {
  const { isAuthenticated } = useContext(AuthContext);
  const { id: carId } = useParams();
  const [car, setCar] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [verifyEmail, setVerifyEmail] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    const carRef = doc(db, "cars", carId);
    const carSnapshot = await getDoc(carRef);
    if (carSnapshot.exists()) {
      const carData = carSnapshot.data();
      const userId = auth.currentUser.uid;
      let updatedLikes = [...(carData.likes || [])];
      if (liked) {
        updatedLikes = updatedLikes.filter((id) => id !== userId);
      } else {
        updatedLikes.push(userId);
      }
      await updateDoc(carRef, { likes: updatedLikes });
      setCar((prevCar) => ({ ...prevCar, likes: updatedLikes }));
      setLiked(!liked);
    }
  };

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const carDocRef = doc(db, "cars", carId);
        const carSnapshot = await getDoc(carDocRef);
        const user = auth;
        if (carSnapshot.exists()) {
          const carData = carSnapshot.data();
          setCar(carData);
          if (user && user.currentUser.email === carData.owner) {
            setIsOwner(true);
          }
          onAuthStateChanged(auth, (user) => {
            if (user && carData.likes && carData.likes.includes(user.uid)) {
              setLiked(true);
            }
          });
        } else {
          console.error("Car does not exist.");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [carId, db, auth]);

  const handleEdit = () => {
    navigate(`/edit/${carId}`);
  };

  const handleDelete = async () => {
    try {
      closeDeleteModal();
      const carDocRef = doc(db, "cars", carId);
      await deleteDoc(carDocRef);
      navigate("/catalog");
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const incrementViews = async (carId) => {
    const carRef = doc(db, "cars", carId);
    await updateDoc(carRef, { views: increment(1) });
    const updatedCarSnapshot = await getDoc(carRef);
    if (updatedCarSnapshot.exists()) {
      setCar(updatedCarSnapshot.data());
    }
  };

  useEffect(() => {
    if (carId) {
      incrementViews(carId);
    }
  }, [carId]);

  useEffect(() => {
    if (!user) return;

    if (user.emailVerified) {
      setVerifyEmail(true);
    }
  }, [user]);

  const openDeleteModal = (isOpen) => {
    setIsOpenDeleteModal(isOpen);
  };
  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPhoto(null);
  };

  const openModal = (photoUrl, index) => {
    setCurrentPhoto(photoUrl);
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-500">
        Car not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-8 flex flex-col items-center">
            <Carousel
              showArrows={true}
              showThumbs={false}
              dynamicHeight={false}
              autoPlay={false}
              infiniteLoop={true}
              selectedItem={selectedIndex}
              onChange={(index) => setSelectedIndex(index)}
              className="w-full max-h-96 rounded-xl overflow-hidden shadow-lg"
            >
              {car.photos.map((photoUrl, index) => {
                const thumbnails = getThumbnailPaths(photoUrl);
                const high = thumbnails?.high || photoUrl;

                return (
                  <div key={index} onClick={() => openModal(photoUrl, index)}>
                    <img
                      src={high}
                      alt={`Car photo ${index + 1}`}
                      className="object-cover w-full h-80 cursor-pointer rounded-xl"
                    />
                  </div>
                );
              })}
            </Carousel>
            <div className="flex gap-2 mt-4 overflow-x-auto overflow-y-hidden">
              {car.photos.map((photoUrl, index) => {
                const thumbnails = getThumbnailPaths(photoUrl);
                const low = thumbnails?.low || photoUrl;

                return (
                  <img
                    key={index}
                    src={low}
                    alt={`Thumbnail ${index + 1}`}
                    className={`size-16 object-cover cursor-pointer border-2 rounded-md transition-all duration-200 ${
                      selectedIndex === index ? "border-blue-500 scale-105" : "border-gray-300"
                    }`}
                    onClick={() => setSelectedIndex(index)}
                  />
                );
              })}
            </div>
          </div>
          <div className="lg:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <span className="flex flex-row items-start justify-between mb-5">
                <h1 className="text-3xl font-bold text-blue-700 mb-2">
                  {car.brand} {car.model}
                </h1>
                <span className="font-semibold">Views: {car.views}</span>
              </span>
              <p className="text-lg text-gray-700 mb-4">{car.description}</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-slate-600 text-base">
                <span>
                  <span className="font-semibold">Brand:</span> {car.brand}
                </span>
                <span>
                  <span className="font-semibold">Model:</span> {car.model}
                </span>
                <span>
                  <span className="font-semibold">Year:</span> {car.year}
                </span>
                <span>
                  <span className="font-semibold">Power:</span> {car.power} HP
                </span>
                <span>
                  <span className="font-semibold">Fuel Type:</span> {car.fuelType}
                </span>
                <span>
                  <span className="font-semibold">Gearbox:</span>{" "}
                  {car.gearbox.charAt(0).toUpperCase() + car.gearbox.slice(1)}
                </span>
                <span>
                  <span className="font-semibold">Color:</span> {car.color}
                </span>
                <span>
                  <span className="font-semibold">Odometer:</span> {car.odometer} km
                </span>
                <span className="col-span-2">
                  <span className="font-semibold">Features:</span>{" "}
                  {car.features?.join(", ") || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-slate-600 text-base mt-6">
                <span>
                  <span className="font-semibold">Location:</span> {car.location}
                </span>
                <span>
                  <span className="font-semibold">Email:</span> {car.owner}
                </span>
                <span>
                  <span className="font-semibold">Phone:</span> {car.phone}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center lg:gap-4 gap-2 ">
                {isAuthenticated && (
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-all"
                  >
                    {liked ? (
                      <>
                        <FaHeart color="red" size={24} />
                        <span className="font-semibold text-blue-700">{car.likes.length}</span>
                      </>
                    ) : (
                      <>
                        <FaRegHeart color="red" size={24} />
                        <span className="font-semibold text-blue-700">{car.likes.length}</span>
                      </>
                    )}
                  </button>
                )}
                <span className="text-gray-400">|</span>
                <span>
                  <span className="font-semibold">Price:</span>{" "}
                  <span className="lg:text-xl font-bold text-green-600">${car.price}</span>
                </span>
                <span className="text-gray-400">|</span>
              </div>
              <div className="flex gap-2">
                {!isOwner && isAuthenticated && user && (
                  <div className="relative group">
                    <button
                      className="bg-blue-500 text-white lg:px-6 lg:py-2 px-4 py-2 ml-2 rounded-lg shadow hover:bg-blue-600 transition-all disabled:bg-blue-800 disabled:cursor-not-allowed"
                      onClick={() => setIsChatOpen(true)}
                      disabled={!user.emailVerified}
                    >
                      {verifyEmail ? "Chat" : "Verify Email"}
                    </button>
                    {!verifyEmail && (
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-gray-700 text-white text-sm p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        Please verify your email to start chatting. Go to your profile settings to verify.
                      </div>
                    )}
                  </div>
                )}

                {isOwner && isAuthenticated && (
                  <div className="flex gap-2 flex-row ml-3">
                    <button
                      onClick={handleEdit}
                      className="bg-orange-400 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-500 transition-all flex items-center justify-center gap-2"
                    >
                      <PencilLine className="w-5 h-5" />
                      <span className="hidden lg:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => openDeleteModal(true)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="hidden lg:inline">Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpenDeleteModal}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Car Modal"
        escapedClose={false}
        className="rounded-lg shadow-lg max-w-full z-20 relative flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-10"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Delete Car</h2>
          <p className="mb-6 text-gray-700">Are you sure you want to delete this car?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={closeDeleteModal}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Car Image Modal"
        escapedClose={false}
        className="rounded-lg shadow-lg max-w-full z-20 relative flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-10"
      >
        <div className="relative w-full max-w-4xl">
          <Carousel
            selectedItem={selectedIndex}
            onChange={(index) => setSelectedIndex(index)}
            showArrows={true}
            showThumbs={false}
            infiniteLoop={true}
            dynamicHeight={false}
            autoPlay={false}
          >
            {car.photos.map((photoUrl, index) => {
              const { high } = getThumbnailPaths(photoUrl) || {};
              return (
                <div key={index} className="flex justify-center items-center h-[70vh]">
                  <img
                    src={high || photoUrl}
                    alt={`Car photo ${index + 1}`}
                    loading="lazy"
                    className="object-contain max-h-[65vh] w-full rounded-xl shadow-lg"
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      </Modal>
      {isChatOpen && (
        <Modal
          isOpen={isChatOpen}
          onRequestClose={() => setIsChatOpen(false)}
          contentLabel="Chat Modal"
          className="rounded-lg shadow-lg max-w-full z-20 relative flex justify-center items-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-10"
        >
          <Chat owner={car.owner} onClose={() => setIsChatOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
