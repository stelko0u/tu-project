import { Link } from "react-router-dom";
import { getThumbnailPaths } from "../../utils/getThumbnailPaths";

export default function CarBox({ car }) {
  const thumbnailPaths = getThumbnailPaths(car.photos?.[0]);
  const low = thumbnailPaths?.low || "/placeholder.jpg";
  const high = thumbnailPaths?.high || "/placeholder.jpg";

  return (
    <Link to={`/details/${car.id}`}>
      <div
        key={car.id}
        className="relative rounded-lg shadow-lg pb-2 cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 duration-300 bg-white text-black"
      >
        <span className="flex absolute bottom-1/3 right-2 bg-primary text-white px-2 py-1 rounded-md">
          <p>$ {car.price.toLocaleString()}</p>
        </span>

        <picture>
          <source srcSet={`${high} 2x, ${low} 1x`} type="image/webp" />
          <img
            src={low}
            alt={car.model}
            loading="lazy"
            className="w-full h-56 object-cover rounded-md"
          />
        </picture>

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_left,rgba(30,30,30,1)_0%,rgba(30,30,30,0)_15%,rgba(30,30,30,0)_100%)]"></div>

        <span className="flex absolute top-2 right-2 text-white gap-1">
          👁 {car.views.toLocaleString()}
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
