import { CalendarDays, DollarSign, Eye, PaintBucket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Engine from "../../icons/engine";
import Calendar from "../../icons/Calendar";
import Cube from "../../icons/Cube";

export default function CarBox({ car }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (car.photos && car.photos[0]) {
      const img = new Image();
      img.src = car.photos[0];
      img.onload = () => setLoading(false);
    } else {
      setLoading(false);
    }
  }, [car.photos]);

  return (
    <Link to={`/details/${car.id}`}>
      <div
        key={car.id}
        className="rounded-lg shadow-lg pb-2 cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 duration-300 bg-white text-black"
        onClick={() => navigate(`/details/${car.id}`)}
      >
        <span className="flex absolute bottom-1/3 right-2 bg-primary text-white px-2 py-1 rounded-md">
          <p>$ {car.price.toLocaleString()}</p>
        </span>
        <img
          src={car.photos?.[0] || "placeholder.jpg"}
          alt={car.model}
          className="w-full h-56 object-cover rounded-md"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_left,rgba(30,30,30,1)_0%,rgba(30,30,30,0)_15%,rgba(30,30,30,0)_100%)]"></div>

        <span className="flex absolute top-2 right-2 text-white gap-1">
          <Eye /> {car.views.toLocaleString()}
        </span>

        <span className="px-4 flex flex-col">
          <h3 className="text-lg font-bold mt-2">
            {car.brand} {car.model}
          </h3>
          <p>Year: {car.year}</p>
          <p>Engine: {car.fuelType}</p>
          <p>Odometer: {car.odometer.toLocaleString()} km</p>
          <p>Gearbox: {car.gearbox.charAt(0).toUpperCase() + car.gearbox.slice(1)}</p>
        </span>
      </div>
    </Link>
  );
}
