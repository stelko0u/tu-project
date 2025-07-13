import React, { useState, useEffect } from "react";
import Dropzone from "../../components/DropZone/DropZone";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";

function EditForm() {
  const { id: carId } = useParams();
  const [selectedStartYear, setSelectedStartYear] = useState("");
  const [endYearOptions, setEndYearOptions] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carInfo, setCarInfo] = useState({
    brand: "",
    model: "",
    gearbox: "",
    color: "",
    price: null,
    owner: "",
    fuelType: "",
    power: null,
    displacement: null,
    odometer: null,
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const startYear = 1920;
  const endYear = 2025;
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  const brandAndModels = {
    Audi: [
      "80",
      "90",
      "100",
      "A1",
      "A2",
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

  useEffect(() => {
    const fetchCarData = async () => {
      const db = getFirestore();
      try {
        const carDoc = await getDoc(doc(db, "cars", carId));

        if (carDoc.exists()) {
          const carData = carDoc.data();

          setCarInfo(carData);
          setSelectedStartYear(carData.year);
          setSelectedBrand(carData.brand);
          setModels(brandAndModels[carData.brand] || []);
          setSelectedFeatures(carData.features || []);
          setFiles(carData.photos || []);
        } else {
          console.error("No car found with this ID.");
          navigate("/catalog");
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        navigate("/catalog");
      }
    };

    fetchCarData();
  }, [carId, navigate]);

  const handleStartYearChange = (event) => {
    const selectedYear = parseInt(event.target.value, 10);
    setSelectedStartYear(selectedYear);
    const filteredEndYears = years.filter((year) => year >= selectedYear);
    setEndYearOptions(filteredEndYears);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarInfo({
      ...carInfo,
      [name]: value,
    });
  };

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
      brand,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "brand",
      "model",
      "gearbox",
      "color",
      "fuelType",
      "power",
      "displacement",
      "odometer",
    ];

    const missingFields = requiredFields.filter((field) => !carInfo[field]);

    if (!selectedStartYear) {
      missingFields.push("year");
    }

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(", ")}`);
      setTimeout(() => setError(null), 5000);
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is currently authenticated.");
      return;
    }

    const storage = getStorage();

    try {
      setLoading(true);

      const existingPhotos = files.filter((file) => typeof file === "string");
      const newFiles = files.filter((file) => typeof file !== "string");

      const fileUploadPromises = newFiles.map(async (file) => {
        const fileRef = ref(storage, `cars/${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
      });

      const uploadedPhotoURLs = await Promise.all(fileUploadPromises);

      const allPhotos = [...existingPhotos, ...uploadedPhotoURLs];

      const updatedCar = {
        ...carInfo,
        year: selectedStartYear,
        features: selectedFeatures,
        photos: allPhotos, 
        owner: user.email,
      };

      const db = getFirestore();
      const carDocRef = doc(db, "cars", carId);

      await updateDoc(carDocRef, updatedCar);
      setLoading(false);
      navigate("/catalog");
    } catch (error) {
      setError("Error updating data, please try again later.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      setLoading(false);
    }
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

  const handleRemoveImage = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="relative p-4 bg-white">
      {error && (
        <div role="alert" className="alert alert-error absolute top-0 right-0 mt-2 mr-2 w-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <span className="loading loading-dots loading-lg custom-spinner"></span>
        </div>
      )}

      <div className="flex flex-col gap-4 justify-center">
        <h1 className="text-2xl font-bold text-start text-black">Edit car information</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <span className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <select
              className="select select-bordered w-full bg-car-400 text-black"
              onChange={handleBrandChange}
              value={selectedBrand}
              name="brand"
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
              className="select select-bordered w-full bg-car-400 text-black"
              disabled={!models.length}
              name="model"
              onChange={handleChange}
              value={carInfo.model}
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
              className="select select-bordered w-full bg-car-400 text-black"
              onChange={handleStartYearChange}
              value={selectedStartYear}
              name="year"
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
              className="select select-bordered w-full bg-car-400 text-black"
              name="gearbox"
              onChange={handleChange}
              value={carInfo.gearbox}
            >
              <option disabled>Gearbox</option>
              <option value="automatic" key="automatic">
                Automatic
              </option>
              <option value="manual" key="manual">
                Manual
              </option>
            </select>
            <select
              className="select select-bordered w-full bg-car-400 text-black"
              name="color"
              onChange={handleChange}
              value={carInfo.color}
            >
              <option disabled>Color</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-full bg-car-400 text-black"
              name="fuelType"
              onChange={handleChange}
              value={carInfo.fuelType}
            >
              <option disabled>Fuel Type</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Power (HP)"
              className="input w-full bg-car-400 placeholder-black font-light text-black"
              min="0"
              name="power"
              value={carInfo.power || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Price ($)"
              className="input w-full bg-car-400 placeholder-black font-light text-black"
              min="0"
              name="price"
              value={carInfo.price || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Displacement (cc)"
              className="input w-full bg-car-400 placeholder-black font-light text-black"
              min="0"
              name="displacement"
              value={carInfo.displacement || ""}
              onChange={handleChange}
            />

            <input
              type="number"
              placeholder="Odometer (km)"
              className="input w-full bg-car-400 placeholder-black font-light text-black"
              min="0"
              name="odometer"
              value={carInfo.odometer || ""}
              onChange={handleChange}
            />
          </span>

          <h2>Select car features:</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {features.map((feature) => (
              <label key={feature} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleCheckboxChange(feature)}
                  className="checkbox checkbox-primary"
                />
                <span>{feature}</span>
              </label>
            ))}
          </div>
          <h2 className="text-lg font-semibold">Existing Photos</h2>
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={typeof file === "string" ? file : URL.createObjectURL(file)}
                  alt={`Car ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white p-0.5 m-0.5 rounded-full"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
          <Dropzone
            onDrop={(acceptedFiles) => setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])}
          />
          <div className="flex justify-end mt-4">
            <input
              type="submit"
              value="Edit"
              className="bg-car-500 text-white p-2 rounded-md hover:cursor-pointer px-12"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditForm;
