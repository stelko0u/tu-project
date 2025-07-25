import React, { useState } from "react";
import Dropzone from "../../components/DropZone/DropZone";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function CarForm() {
  const [selectedStartYear, setSelectedStartYear] = useState("");
  const [endYearOptions, setEndYearOptions] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [views, setViews] = useState(0);
  const [carInfo, setCarInfo] = useState({
    brand: "",
    model: "",
    gearbox: "",
    color: "",
    price: 0,
    owner: "",
    fuelType: "",
    power: 0,
    displacement: 0,
    odometer: 0,
    phone: "",
    location: "",
    views: 0,
    likes: [],
  });
  const [error, setError] = useState(null);
  const startYear = 1920;
  const endYear = 2025;
  const navigate = useNavigate();
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  const handleStartYearChange = (event) => {
    const selectedYear = parseInt(event.target.value, 10);
    setSelectedStartYear(selectedYear);
    const filteredEndYears = years.filter((year) => year >= selectedYear);
    setEndYearOptions(filteredEndYears);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "price" || name === "power" || name === "displacement" || name === "odometer"
        ? parseFloat(value) || 0
        : value;
    setCarInfo({
      ...carInfo,
      [name]: newValue,
    });
  };

  const brandAndModels = {
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

  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];

  const features = [
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

  const handleCheckboxChange = (feature) => {
    setSelectedFeatures((prevSelectedFeatures) =>
      prevSelectedFeatures.includes(feature)
        ? prevSelectedFeatures.filter((item) => item !== feature)
        : [...prevSelectedFeatures, feature]
    );
  };

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setModels(brandAndModels[brand] || []);
    setCarInfo((prevInfo) => ({
      ...prevInfo,
      brand: brand,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = [
      "brand",
      "model",
      "gearbox",
      "price",
      "color",
      "fuelType",
      "power",
      "displacement",
      "odometer",
      "phone",
      "location",
    ];

    const missingFields = requiredFields.filter((field) => !carInfo[field]);

    if (!selectedStartYear) {
      missingFields.push("year");
    }

    const phoneRegex = /^(088|089|087)\d{7}$/;
    if (!phoneRegex.test(carInfo.phone)) {
      setError("Invalid phone number format. Please enter a valid phone number.");
      setTimeout(() => setError(null), 5000);
      setLoading(false);
      return;
    }

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(", ")}`);
      setTimeout(() => setError(null), 5000);
      setLoading(false);
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is currently authenticated.");
      setLoading(false);
      return;
    }

    const storage = getStorage();

    try {
      const fileUploadPromises = files.map(async (file) => {
        const fileRef = ref(storage, `cars/${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
      });
      const photoURLs = await Promise.all(fileUploadPromises);

      const newCar = {
        ...carInfo,
        year: selectedStartYear,
        features: selectedFeatures,
        photos: photoURLs,
        owner: user.email,
        views: 0,
      };

      const db = getFirestore();
      const carsCollectionRef = collection(db, "cars");

      await addDoc(carsCollectionRef, newCar);
      setLoading(false);
      navigate("/catalog");
    } catch (error) {
      setError("Error uploading data, please try again later.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center py-10 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 relative">
        {error && (
          <div
            role="alert"
            className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow z-10"
          >
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <span className="loading loading-dots loading-lg custom-spinner"></span>
          </div>
        )}

        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Add a New Car</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <select
              className="select select-bordered w-full bg-blue-50 text-black"
              onChange={handleBrandChange}
              value={selectedBrand}
              name="brand"
              required
            >
              <option disabled value="">
                Brand
              </option>
              {Object.keys(brandAndModels).map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-full bg-blue-50 text-black"
              disabled={!models.length}
              name="model"
              onChange={handleChange}
              value={carInfo.model}
              required
            >
              <option disabled value="">
                Model
              </option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-full bg-blue-50 text-black"
              onChange={handleStartYearChange}
              value={selectedStartYear}
              name="year"
              required
            >
              <option disabled value="">
                Year
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-full bg-blue-50 text-black"
              name="gearbox"
              onChange={handleChange}
              value={carInfo.gearbox}
              required
            >
              <option disabled value="">
                Gearbox
              </option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>

            <select
              className="select select-bordered w-full bg-blue-50 text-black"
              name="color"
              onChange={handleChange}
              value={carInfo.color}
              required
            >
              <option disabled value="">
                Color
              </option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-full bg-blue-50 text-black"
              name="fuelType"
              onChange={handleChange}
              value={carInfo.fuelType}
              required
            >
              <option disabled value="">
                Fuel Type
              </option>
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Power (HP)"
              className="input input-bordered w-full bg-blue-50 placeholder-black text-black"
              min="0"
              name="power"
              value={carInfo.power === 0 ? "" : carInfo.power}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Price ($)"
              className="input input-bordered w-full bg-blue-50 placeholder-black text-black"
              min={0}
              name="price"
              value={carInfo.price === 0 ? "" : carInfo.price}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Displacement (cc)"
              className="input input-bordered w-full bg-blue-50 placeholder-black text-black"
              min="0"
              name="displacement"
              value={carInfo.displacement === 0 ? "" : carInfo.displacement}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              placeholder="Odometer (km)"
              className="input input-bordered w-full bg-blue-50 placeholder-black text-black"
              min="0"
              name="odometer"
              value={carInfo.odometer === 0 ? "" : carInfo.odometer}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              placeholder="Location"
              className="input input-bordered w-full bg-blue-50 placeholder-black text-black"
              name="location"
              value={carInfo.location}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              placeholder="Phone Number"
              className="input input-bordered w-full bg-blue-50 placeholder-black text-black"
              name="phone"
              value={carInfo.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Select Car Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {features.map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => handleCheckboxChange(feature)}
                    className="checkbox checkbox-primary"
                  />
                  <span className="text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Upload Car Photos</h2>
            <Dropzone
              onDrop={(acceptedFiles) => setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])}
            />
          </div>

          <div className="flex justify-end mt-4">
            <input
              type="submit"
              value="Add Car"
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:scale-105 transition-all cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CarForm;
