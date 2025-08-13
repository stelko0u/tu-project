import React, { useState, useEffect, useRef } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import CarBox from "../../components/CarBox/CarBox";

export default function Catalog() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    features: [],
    minPrice: "",
    maxPrice: "",
    year: "",
    fuelType: "",
    gearbox: "",
    color: "",
    location: "",
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
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPriceDropdownOpen]);

  const filteredCars = cars.filter((car) => {
    const matchesBrand = filters.brand ? car.brand === filters.brand : true;
    const matchesModel = filters.model ? car.model === filters.model : true;
    const matchesFeatures = filters.features.length
      ? filters.features.every((feature) => car.features?.includes(feature))
      : true;
    const carPrice = typeof car.price === "number" ? car.price : parseFloat(car.price);
    const minPriceFilter = filters.minPrice === "" ? null : parseFloat(filters.minPrice);
    const maxPriceFilter = filters.maxPrice === "" ? null : parseFloat(filters.maxPrice);
    const matchesMinPrice =
      minPriceFilter === null || (!isNaN(minPriceFilter) && carPrice >= minPriceFilter);
    const matchesMaxPrice =
      maxPriceFilter === null || (!isNaN(maxPriceFilter) && carPrice <= maxPriceFilter);
    const matchesYear = filters.year ? String(car.year) === String(filters.year) : true;
    const matchesFuelType = filters.fuelType ? car.fuelType === filters.fuelType : true;
    const matchesGearbox = filters.gearbox ? car.gearbox === filters.gearbox : true;
    const matchesColor = filters.color ? car.color === filters.color : true;
    const matchesLocation = filters.location
      ? car.location?.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    return (
      matchesBrand &&
      matchesModel &&
      matchesFeatures &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesYear &&
      matchesFuelType &&
      matchesGearbox &&
      matchesColor &&
      matchesLocation
    );
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
    const nonNegativeValue =
      value === "" ? "" : isNaN(numberValue) ? value : Math.max(0, numberValue);
    setFilters((prevFilters) => ({
      ...prevFilters,
      minPrice: nonNegativeValue,
    }));
  };

  const handleMaxPriceChange = (event) => {
    const value = event.target.value;
    const numberValue = parseInt(value, 10);
    const nonNegativeValue =
      value === "" ? "" : isNaN(numberValue) ? value : Math.max(0, numberValue);
    setFilters((prevFilters) => ({
      ...prevFilters,
      maxPrice: nonNegativeValue,
    }));
  };

  const handleYearChange = (event) => {
    setFilters({ ...filters, year: event.target.value });
  };

  const handleFuelTypeChange = (event) => {
    setFilters({ ...filters, fuelType: event.target.value });
  };

  const handleGearboxChange = (event) => {
    setFilters({ ...filters, gearbox: event.target.value });
  };

  const handleColorChange = (event) => {
    setFilters({ ...filters, color: event.target.value });
  };

  const handleLocationChange = (event) => {
    setFilters({ ...filters, location: event.target.value });
  };

  const togglePriceDropdown = () => {
    setPriceDropdownOpen(!isPriceDropdownOpen);
  };

  const carData = {
    Audi: [
      "80",
      "90",
      "100",
      "А1",
      "А2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "Q3",
      "Q5",
      "Q7",
      "Q8",
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
    "Air Conditioning",
    "Leather Seats",
    "Navigation System",
    "Bluetooth",
    "Rear Camera",
    "Cruise Control",
    "Heated Seats",
    "Panoramic Roof",
    "Alarm System",
    "Parking Sensors",
    "Adaptive Headlights",
    "Keyless Entry",
    "Adaptive Cruise Control",
    "Automatic Traffic Sign Recognition",
    "LED Lights",
    "Blind Spot Monitoring System",
    "Automatic Transmission",
    "Electric Seats",
    "Traction Control",
    "Stability Control (ESP)",
    "Electric Windows",
    "Electric Mirrors",
    "On-board Computer",
    "Sunroof",
    "Multifunction Steering Wheel",
    "4x4 Drive",
    "Automatic Climate Control",
    "Tuning",
  ];

  const years = [];
  for (let year = 1920; year <= 2025; year++) years.push(year);

  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const gearboxes = ["Automatic", "Manual"];
  const colors = [
    "Red",
    "Green",
    "Blue",
    "Yellow",
    "Purple",
    "Orange",
    "Pink",
    "Brown",
    "Black",
    "White",
    "Silver Gray",
  ];

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-8 px-2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center w-full">
            <select
              onChange={handleBrandChange}
              value={filters.brand}
              className="select select-bordered min-w-[120px] max-w-[180px] bg-blue-50"
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
              className="select select-bordered min-w-[120px] max-w-[180px] bg-blue-50"
            >
              <option value="">All Models</option>
              {(carData[filters.brand] || []).map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

            <select
              onChange={handleYearChange}
              value={filters.year}
              className="select select-bordered min-w-[100px] max-w-[120px] bg-blue-50"
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              onChange={handleFuelTypeChange}
              value={filters.fuelType}
              className="select select-bordered min-w-[120px] max-w-[150px] bg-blue-50"
            >
              <option value="">Fuel</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>

            <select
              onChange={handleGearboxChange}
              value={filters.gearbox}
              className="select select-bordered min-w-[120px] max-w-[150px] bg-blue-50"
            >
              <option value="">Gearbox</option>
              {gearboxes.map((gear) => (
                <option key={gear} value={gear}>
                  {gear}
                </option>
              ))}
            </select>

            <select
              onChange={handleColorChange}
              value={filters.color}
              className="select select-bordered min-w-[120px] max-w-[150px] bg-blue-50"
            >
              <option value="">Color</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={handleLocationChange}
              className="input input-bordered min-w-[120px] max-w-[150px] bg-blue-50"
            />

            <button
              className="btn bg-[#168f7a] text-white min-w-[120px] max-w-[150px]"
              onClick={openModal}
              type="button"
            >
              Features
            </button>

            <div className="relative min-w-[120px] max-w-[150px]">
              <button
                ref={priceButtonRef}
                className="btn bg-gray-700 text-white w-full"
                onClick={togglePriceDropdown}
                type="button"
              >
                Price
              </button>
              {isPriceDropdownOpen && (
                <div
                  ref={priceDropdownRef}
                  className="absolute top-full left-0 mt-2 p-4 bg-gray-800 rounded-md shadow-lg z-20 flex flex-col gap-2 min-w-[180px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label className="text-sm text-gray-300">Min:</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleMinPriceChange}
                    min="0"
                    className="input input-bordered w-full input-sm"
                  />
                  <label className="text-sm text-gray-300">Max:</label>
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
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg relative w-11/12 max-w-3xl h-2/3 flex flex-col"
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto flex-grow">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCars.map((car) => (
            <CarBox key={car.id} car={car} />
          ))}
          {filteredCars.length === 0 && (
            <div className="col-span-full text-center text-gray-600 text-xl py-12">
              No cars match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
