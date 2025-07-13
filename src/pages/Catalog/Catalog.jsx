import React, { useState, useEffect, useRef } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import CarBox from "../../components/CarBox/CarBox";

export default function Catalog() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    features: [],
    minPrice: '',
    maxPrice: '',
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPriceDropdownOpen, setPriceDropdownOpen] = useState(false);

  const priceDropdownRef = useRef(null);
  const priceButtonRef = useRef(null);


  useEffect(() => {
    const fetchCars = async () => {
      try {
        const db = getFirestore();
        const carsCollectionRef = collection(db, "cars");

        const querySnapshot = await getDocs(carsCollectionRef);
        const carsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCars(carsList);

      } catch (error) {
        console.error("Error fetching cars data:", error);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        priceDropdownRef.current &&
        !priceDropdownRef.current.contains(event.target) &&
        priceButtonRef.current &&
        !priceButtonRef.current.contains(event.target)
      ) {
        setPriceDropdownOpen(false);
      }
    };

    if (isPriceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPriceDropdownOpen]);


  const filteredCars = cars.filter((car) => {
    const matchesBrand = filters.brand ? car.brand === filters.brand : true;
    const matchesModel = filters.model ? car.model === filters.model : true;
    const matchesFeatures = filters.features.length
      ? filters.features.every((feature) => car.features.includes(feature))
      : true;

    const carPrice = typeof car.price === 'number' ? car.price : parseFloat(car.price);

    const minPriceFilter = filters.minPrice === '' ? null : parseFloat(filters.minPrice);
    const maxPriceFilter = filters.maxPrice === '' ? null : parseFloat(filters.maxPrice);

    const matchesMinPrice = minPriceFilter === null || (!isNaN(minPriceFilter) && carPrice >= minPriceFilter);
    const matchesMaxPrice = maxPriceFilter === null || (!isNaN(maxPriceFilter) && carPrice <= maxPriceFilter);

    return matchesBrand && matchesModel && matchesFeatures && matchesMinPrice && matchesMaxPrice;
  });

  const handleBrandChange = (event) => {
    setFilters({
      ...filters,
      brand: event.target.value,
      model: "",
    });
  };

  const handleModelChange = (event) => {
    setFilters({
      ...filters,
      model: event.target.value,
    });
  };

  const handleFeatureChange = (feature) => {
    setFilters((prevFilters) => {
      const newFeatures = prevFilters.features.includes(feature)
        ? prevFilters.features.filter((f) => f !== feature)
        : [...prevFilters.features, feature];
      return { ...prevFilters, features: newFeatures };
    });
  };

  const handleMinPriceChange = (event) => {
      const value = event.target.value;
      const numberValue = parseInt(value, 10);

      const nonNegativeValue = value === '' ? '' : (isNaN(numberValue) ? value : Math.max(0, numberValue));

      setFilters(prevFilters => ({
         ...prevFilters,
         minPrice: nonNegativeValue,
      }));
  };

  const handleMaxPriceChange = (event) => {
       const value = event.target.value;
       const numberValue = parseInt(value, 10);

       const nonNegativeValue = value === '' ? '' : (isNaN(numberValue) ? value : Math.max(0, numberValue));

       setFilters(prevFilters => ({
          ...prevFilters,
          maxPrice: nonNegativeValue,
       }));
  };

  const togglePriceDropdown = () => {
      setPriceDropdownOpen(!isPriceDropdownOpen);
  };

  const carData = {
    Audi: [
      "80", "90", "100", "А1", "А2", "A3", "A4", "A5", "A6", "A7", "A8",
      "Q3", "Q5", "Q7", "Q8",
    ],
    BMW: ["X5", "320i", "M3", "M5", "X3", "X6", "X7", "X1", "X2", "X4"],
    Mercedes: ["C-Class", "E-Class", "GLA", "GLC", "GLE", "GLS", "S-Class"],
    Volvo: ["XC90", "S60", "V40", "V70", "XC70", "S80", "V50", "V60"],
    Renault: ["Clio", "Megane", "Captur", "Kadjar", "Koleos", "Talisman"],
    Ford: ["Focus", "Fiesta", "Mondeo", "Kuga", "EcoSport", "Mustang"],
    Opel: ["Astra", "Insignia", "Corsa", "Mokka", "Grandland X", "Crossland X"],
    Fiat: ["500", "Panda", "Tipo", "500X", "500L", "Doblo"],
    Honda: ["Civic", "Accord", "CR-V", "HR-V", "Jazz", "NSX"],
    Toyota: ["Corolla", "Camry", "RAV4", "Yaris", "Land Cruiser", "Prius"],
    Nissan: ["Qashqai", "Juke", "X-Trail", "Micra", "Leaf", "GT-R"],
    "Land Rover": ["Discovery", "Defender", "Range Rover", "Freelander"],
    Suzuki: ["Swift", "Vitara", "SX4", "Jimny", "Ignis", "Baleno"],
    Hyundai: ["i30", "i20", "Tucson", "Kona", "Santa Fe", "Ioniq"],
    Bentley: ["Continental", "Bentayga", "Flying Spur"],
    Volkswagen: ["Golf", "Passat", "Tiguan", "Touareg", "Arteon", "Polo"],
    Mazda: ["CX-5", "3", "6", "CX-3", "MX-5", "CX-30"],
    Porsche: ["911", "Cayenne", "Taycan", "Panamera", "Macan", "Boxster"],
    Chevrolet: ["Malibu", "Impala", "Camaro", "Corvette", "Equinox", "Traverse"],
    Jaguar: ["XE", "XF", "F-Type", "E-Pace", "F-Pace", "I-Pace"],
    Subaru: ["Impreza", "Forester", "Outback", "XV", "BRZ", "Levorg"],
  };

  const featuresList = [
    "Air Conditioning", "Leather Seats", "Navigation System", "Bluetooth",
    "Rear Camera", "Cruise Control", "Heated Seats", "Panoramic Roof",
    "Alarm System", "Parking Sensors", "Adaptive Headlights", "Keyless Entry",
    "Adaptive Cruise Control", "Automatic Traffic Sign Recognition", "LED Lights",
    "Blind Spot Monitoring System", "Automatic Transmission", "Electric Seats",
    "Traction Control", "Stability Control (ESP)", "Electric Windows",
    "Electric Mirrors", "On-board Computer", "Sunroof", "Multifunction Steering Wheel",
    "4x4 Drive", "Automatic Climate Control", "Tuning",
  ];

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="p-8 w-full bg-[#222222]">
      <div className="flex flex-wrap gap-4 my-3 items-center">
        <select
          onChange={handleBrandChange}
          value={filters.brand}
          className="select select-bordered min-w-[150px] max-w-[200px]"
        >
          <option value="">All Brands</option>
          {Object.keys(carData).map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          onChange={handleModelChange}
          value={filters.model}
          disabled={!filters.brand}
          className="select select-bordered min-w-[150px] max-w-[200px]"
        >
          <option value="">All Models</option>
          {(carData[filters.brand] || []).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <button
            className="btn bg-[#168f7a] text-white w-40"
            onClick={openModal}
        >
          Select Features
        </button>

        <div className="relative w-40">
             <button
                ref={priceButtonRef}
                className="btn bg-gray-700 text-white w-full"
                onClick={togglePriceDropdown}
             >
                Search by Price
             </button>

             {isPriceDropdownOpen && (
                 <div
                     ref={priceDropdownRef}
                     className="absolute top-full left-0 mt-2 p-4 bg-gray-800 rounded-md shadow-lg z-20 flex flex-col gap-2 min-w-[200px]"
                     onClick={(e) => e.stopPropagation()}
                 >
                     <label className="text-sm text-gray-300">Lowest End:</label>
                     <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleMinPriceChange}
                        min="0"
                        className="input input-bordered w-full input-sm"
                     />

                    <label className="text-sm text-gray-300">Highest End:</label>
                     <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleMaxPriceChange}
                        min="0"
                        className="input input-bordered w-full input-sm"
                     />
                 </div>
             )}
        </div>

      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg relative w-4/5 h-2/3 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex justify-between mb-4 items-center flex-shrink-0">
              <h2 className="text-xl font-bold text-slate-600">Select Features</h2>
              <button
                className="p-2 bg-[#168f7a] text-white px-4 py-1 rounded-md"
                onClick={closeModal}
              >
                Close
              </button>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-grow">
              {featuresList.map((feature) => (
                <label key={feature} className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature)}
                    onChange={() => handleFeatureChange(feature)}
                    className="checkbox checkbox-primary"
                  />
                  <span className="ml-2">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredCars.map((car) => (
          <CarBox key={car.id} car={car} />
        ))}
         {filteredCars.length === 0 && (
            <div className="col-span-full text-center text-white text-xl">
                No cars match your filters.
            </div>
        )}
      </div>
    </div>
  );
}