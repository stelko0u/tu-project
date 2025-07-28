import CarBox from "../CarBox/CarBox";
import { Trash2 } from "lucide-react";

const CarsList = ({ cars, onDelete }) => {
  if (!cars?.length) {
    return <div className="text-white text-center mt-8">No car offers found.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Car Offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="relative group">
            <CarBox car={car} />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(car.id);
              }}
              className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 z-10 transition-transform duration-200 group-hover:scale-125"
              aria-label="Delete car"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarsList;
