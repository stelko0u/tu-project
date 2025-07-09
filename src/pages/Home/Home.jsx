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
    <div>
      <span className="bg-primary">
        <div className="flex justify-center items-center ">
          <span className="relative w-full h-52 ">
            <img
              src={homeWelcome}
              alt="homeSellIt"
              className="w-full h-full object-cover brightness-50 "
            />
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
              <p className="text-lg md:text-xl lg:text-2xl font-semibold">
                Buy or sell your car quickly and easily!
              </p>
              <p className="text-base md:text-lg lg:text-xl mt-2">
                Welcome to Car Deals - the place where buying and selling cars is easier than ever!
              </p>
              <p className="text-sm md:text-base lg:text-lg mt-2">
                Whether you’re looking for a new car or want to sell your old one, you’ll find the
                best deals here.
              </p>
            </div>
          </span>
        </div>
      </span>
      <section className="flex py-5 px-8 bg-primary w-full text-white flex-col ">
        <span className="flex justify-between w-full">
          <p className="text-xl">Most viewed cars</p>
          <Link to="/catalog" className="text-lg">
            View catalog →
          </Link>
        </span>
        <span className="grid grid-cols-1 px-4 py-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-3">
          {topCars.map((car) => (
            <CarBox key={car.id} car={car} />
          ))}
        </span>
      </section>
      <div className="flex justify-center items-center ">
        <span className="relative w-full h-52 ">
          <img
            src={homeSellIt}
            alt="homeSellIt"
            className="w-full h-full object-cover brightness-50 "
          />
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
            <span className="flex flex-col items-center mt-4">
              <p className="text-3xl">Do you want to sell your car quickly and securely?</p>
              <Link
                to="add"
                className="bg-[#004D40] text-xl py-1.5 px-3 rounded-md mt-2 hover:bg-[#0b2a26] transition-all duration-300"
              >
                Sell it now
              </Link>
            </span>
          </div>
        </span>
      </div>
    </div>
  );
}
