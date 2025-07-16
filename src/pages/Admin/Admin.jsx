import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase';
import { Eye, Trash2, User } from 'lucide-react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AdminPage = () => {
    const [cars, setCars] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentView, setCurrentView] = useState(null);
    const [isDeleteCarModalOpen, setIsDeleteCarModalOpen] = useState(false);
    const [carToDeleteId, setCarToDeleteId] = useState(null);
    const [isDeleteMessageModalOpen, setIsDeleteMessageModalOpen] = useState(false);
    const [messageToDeleteId, setMessageToDeleteId] = useState(null);

    let db;
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    } catch (e) {
        console.warn("Firebase might be already initialized:", e);
    }

    const navigate = useNavigate();

    const handleCarsClick = async () => {
        setCurrentView('cars');
        setLoading(true);
        setError(null);
        setMessages([]);
        try {
            const carsCollection = collection(db, 'cars');
            const carsSnapshot = await getDocs(carsCollection);
            const carsData = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCars(carsData);
        } catch (err) {
            console.error("Error fetching cars:", err);
            setError(err);
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMessagesClick = async () => {
        setCurrentView('messages');
        setLoading(true);
        setError(null);
        setCars([]);
        try {
            const messagesCollection = collection(db, 'contacts');
            const messagesSnapshot = await getDocs(messagesCollection);
            const messagesData = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData);
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError(err);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const openDeleteCarModal = (carId) => {
        setCarToDeleteId(carId);
        setIsDeleteCarModalOpen(true);
    };

    const closeDeleteCarModal = () => {
        setIsDeleteCarModalOpen(false);
        setCarToDeleteId(null);
    };

    const openDeleteMessageModal = (messageId) => {
        setMessageToDeleteId(messageId);
        setIsDeleteMessageModalOpen(true);
    };

    const closeDeleteMessageModal = () => {
        setIsDeleteMessageModalOpen(false);
        setMessageToDeleteId(null);
    };

    const handleDeleteCar = async () => {
        if (!carToDeleteId) return;
        closeDeleteCarModal();
        setLoading(true);
        setError(null);
        try {
            const carDocRef = doc(db, 'cars', carToDeleteId);
            await deleteDoc(carDocRef);
            await handleCarsClick();
        } catch (error) {
            console.error('Error deleting car:', error);
            setError(error);
            setLoading(false);
        }
    };

    const handleDeleteMessage = async () => {
        if (!messageToDeleteId) return;
        closeDeleteMessageModal();
        setLoading(true);
        setError(null);
        try {
            const messageDocRef = doc(db, 'contacts', messageToDeleteId);
            await deleteDoc(messageDocRef);
            await handleMessagesClick();
        } catch (error) {
            console.error('Error deleting message:', error);
            setError(error);
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) return <div className="text-white text-center mt-8">Loading data...</div>;
        if (error) return <div className="text-red-400 text-center mt-8">Error: {error.message}</div>;

        if (currentView === 'cars') {
            if (cars.length > 0) {
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-white">Car Offers</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cars.map(car => (
                                <div key={car.id} className="relative rounded-lg shadow-lg pb-2 cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 duration-300 bg-white text-black">
                                    <Link to={`/details/${car.id}`}>
                                        <span className="flex absolute bottom-1/3 right-2 bg-primary text-white px-2 py-1 rounded-md z-10">
                                            <p>$ {car.price ? car.price.toLocaleString() : 'N/A'}</p>
                                        </span>
                                        <img src={car.photos?.[0] || '/placeholder-image.png'} alt={`${car.brand || ''} ${car.model || 'Car'}`} className="w-full h-56 object-cover rounded-t-md" />
                                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_left,rgba(30,30,30,1)_0%,rgba(30,30,30,0)_15%,rgba(30,30,30,0)_100%)] rounded-t-md"></div>
                                        {car.views !== undefined && (
                                            <span className="flex absolute top-2 right-2 text-white gap-1 z-10">
                                                <Eye size={16} /> {car.views.toLocaleString()}
                                            </span>
                                        )}
                                        <span className="px-4 flex flex-col pb-8">
                                            <h3 className="text-lg font-bold mt-2 truncate">{car.brand} {car.model}</h3>
                                            <p className="text-sm text-gray-600">Year: {car.year || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Engine: {car.fuelType || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Odometer: {car.odometer ? car.odometer.toLocaleString() + ' km' : 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Gearbox: {car.gearbox ? car.gearbox.charAt(0).toUpperCase() + car.gearbox.slice(1) : 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Color: {car.color || 'N/A'}</p>
                                        </span>
                                    </Link>
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDeleteCarModal(car.id); }} className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none z-10" aria-label="Delete car">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            return <div className="text-white text-center mt-8">No car offers found.</div>;
        }

        if (currentView === 'messages') {
            if (messages.length > 0) {
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-white">Messages</h2>
                        <div className="space-y-4">
                            {messages.map(message => (
                                <div key={message.id} className="bg-gray-100 rounded-lg p-4 shadow-md text-gray-800 relative">
                                    <button onClick={() => openDeleteMessageModal(message.id)} className="absolute top-3 right-3 text-red-500 hover:text-red-600 p-1" aria-label="Delete message">
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="flex items-center gap-3 mb-2 pr-8">
                                        <User size={20} className="text-gray-500" />
                                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                                            <h6 className="font-semibold text-base text-gray-900">{message.name || 'No Name'}</h6>
                                            <span className="text-sm text-gray-600">{message.email ? `<${message.email}>` : ''}</span>
                                            {message.email && message.phone && <span className="text-sm text-gray-500 mx-1">•</span>}
                                            <span className="text-sm text-gray-600">{message.phone ? `+${message.phone}` : ''}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap break-words text-gray-700 pl-8">{message.message || 'No message content.'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            return <div className="text-white text-center mt-8">No messages found.</div>;
        }

        return null;
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#212121]">
            <aside className="w-full lg:w-64 bg-[#19191F] text-white p-4 flex flex-col">
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-semibold">Admin Menu</h2>
                </div>
                <nav className="space-y-2 flex-grow">
                    <button className={`block w-full text-left p-2 rounded ${currentView === 'cars' ? 'bg-gray-700' : 'hover:bg-gray-700'}`} onClick={handleCarsClick} disabled={loading}>Cars</button>
                    <button className={`block w-full text-left p-2 rounded ${currentView === 'messages' ? 'bg-gray-700' : 'hover:bg-gray-700'}`} onClick={handleMessagesClick} disabled={loading}>Messages</button>
                </nav>
                <Link to="/profile" className="block w-full text-left p-2 hover:bg-gray-700 rounded mt-auto text-center border-t border-gray-700 pt-4">Exit Admin</Link>
            </aside>

            <main className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-6 text-white">Welcome to Admin Panel</h1>
                {renderContent()}
            </main>

            <Modal isOpen={isDeleteCarModalOpen} onRequestClose={closeDeleteCarModal} contentLabel="Delete Car Confirmation" className="fixed inset-0 z-50 flex items-center justify-center p-4" overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
                    <p className="mb-6 text-gray-600">Are you sure you want to delete this car offer?</p>
                    <div className="flex justify-end gap-4">
                        <button onClick={closeDeleteCarModal} className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md">Cancel</button>
                        <button onClick={handleDeleteCar} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md">Delete</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isDeleteMessageModalOpen} onRequestClose={closeDeleteMessageModal} contentLabel="Delete Message Confirmation" className="fixed inset-0 z-50 flex items-center justify-center p-4" overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
                    <p className="mb-6 text-gray-600">Are you sure you want to delete this message?</p>
                    <div className="flex justify-end gap-4">
                        <button onClick={closeDeleteMessageModal} className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md">Cancel</button>
                        <button onClick={handleDeleteMessage} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminPage;