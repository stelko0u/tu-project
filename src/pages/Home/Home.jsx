import { getAuth } from "firebase/auth";
import homeSellIt from "../../../public/homeSellIt.jpg";
import homeWelcome from "../../../public/homeWelcome.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import CarBox from "../../components/CarBox/CarBox";

export default function Home() {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const [topCars, setTopCars] = useState([]);

  useEffect(() => {
    const fetchTopCars = async () => {
      try {
        const carsRef = collection(db, "cars");
        const q = query(carsRef, orderBy("views", "desc"), limit(4));
        const querySnapshot = await getDocs(q);

        const carsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTopCars(carsList);
      } catch (error) {
        console.error("Error fetching top cars:", error);
      }
    };

    fetchTopCars();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[320px] md:h-[400px] lg:h-[480px] flex items-center justify-center">
        <img
          src={homeWelcome}
          alt="Welcome"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Buy or Sell Your Car Easily!
          </h1>
          <p className="text-lg md:text-2xl mb-2 font-medium">
            Welcome to AutoCars – the place where buying and selling cars is easier than ever!
          </p>
          <p className="text-base md:text-lg mb-4">
            Find your dream car or sell your old one quickly and securely.
          </p>
          <Link
            to="/catalog"
            className="bg-[#168f7a] hover:bg-[#0b2a26] text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
          >
            Browse Catalog
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 text-center mb-8">
          Why Choose AutoCars?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <span className="text-4xl mb-2">🚗</span>
            <h3 className="font-semibold text-lg mb-2 text-blue-600">Wide Selection</h3>
            <p className="text-gray-600">
              Browse hundreds of cars from trusted sellers. Find the perfect match for your needs
              and budget.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <span className="text-4xl mb-2">⚡</span>
            <h3 className="font-semibold text-lg mb-2 text-blue-600">Fast & Easy</h3>
            <p className="text-gray-600">
              Post your car ad in minutes or contact sellers instantly. Our platform is designed for
              speed and simplicity.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <span className="text-4xl mb-2">🔒</span>
            <h3 className="font-semibold text-lg mb-2 text-blue-600">Secure Transactions</h3>
            <p className="text-gray-600">
              Your safety is our priority. Communicate securely and avoid scams with verified users.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-blue-700">Most Viewed Cars</h2>
          <Link to="/catalog" className="text-blue-600 hover:underline text-lg mt-2 md:mt-0">
            View Full Catalog →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCars.map((car) => (
            <CarBox key={car.id} car={car} />
          ))}
          {topCars.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-lg py-8">
              No cars found.
            </div>
          )}
        </div>
      </section>

      <section className="relative w-full h-[220px] md:h-[280px] flex items-center justify-center mb-0">
        <img
          src={homeSellIt}
          alt="Sell Your Car"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Want to sell your car quickly?</h2>
          <p className="text-base md:text-lg mb-4">
            Post your ad now and reach thousands of buyers!
          </p>
          <Link
            to="/add"
            className="bg-[#168f7a] hover:bg-[#0b2a26] text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
          >
            Sell It Now
          </Link>
        </div>
      </section>
    </div>
  );
}
