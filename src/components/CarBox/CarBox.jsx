// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import getThumbnailUrl from "../../services/getThumbnail";

// export default function CarBox({ car }) {
//   const [loading, setLoading] = useState(true);

//   const [thumbnail, setThumbnail] = useState(null);
//   useEffect(() => {
//     let isMounted = true;
//     const loadThumbnail = async () => {
//       const url = await getThumbnailUrl(car.photos?.[0]);
//       if (isMounted) {
//         setThumbnail(url);
//         setLoading(false);
//         getThumbnailPaths(url)
//       }
//     };
//     loadThumbnail();
//     return () => {
//       isMounted = false;
//     };
//   }, [car.photos]);
//   // const thumbnail = getThumbnailUrl(car.photos?.[0]);

//   // useEffect(() => {
//   //   if (thumbnail) {
//   //     const img = new Image();
//   //     img.src = thumbnail;
//   //     img.onload = () => setLoading(false);
//   //   } else {
//   //     setLoading(false);
//   //   }
//   // }, [thumbnail]);
//   // useEffect(() => {
//   //   if (car.photos && car.photos[0]) {
//   //     const img = new Image();
//   //     img.src = car.photos[0];
//   //     img.onload = () => setLoading(false);
//   //   } else {
//   //     setLoading(false);
//   //   }
//   // }, [car.photos]);

//   function getThumbnailPaths(photoUrl) {
//     if (!photoUrl) return null;

//     const match = decodeURIComponent(photoUrl).match(/\/o\/(cars%2F.+?)\?/);
//     console.log(match);

//     if (!match) return null;

//     const fullPath = decodeURIComponent(match[1]); // cars/pic1.png
//     const fileName = fullPath.split("/").pop(); // pic1.png
//     const baseName = fileName.replace(/\.[^/.]+$/, ""); // pic1
//     console.log(`Base name: ${baseName}`);
//     console.log(`Full path: ${fullPath}`);
//     console.log(`File name: ${fileName}`);

//     return {
//       low: `/images/cars/thumbnails/${baseName}_400x225.webp`,
//       high: `/images/cars/thumbnails/${baseName}_800x450.webp`,
//     };
//   }
//   const { low, high } = getThumbnailPaths(car.photos?.[0]) || {};
//   return (
//     <Link to={`/details/${car.id}`}>
//       <div
//         key={car.id}
//         className="rounded-lg shadow-lg pb-2 cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 duration-300 bg-white text-black"
//       >
//         <span className="flex absolute bottom-1/3 right-2 bg-primary text-white px-2 py-1 rounded-md">
//           <p>$ {car.price.toLocaleString()}</p>
//         </span>
//         {/* <img
//           loading="lazy"
//           src={thumbnail || "placeholder.jpg"}
//           alt={car.model}
//           className="w-full h-56 object-cover rounded-md"
//         /> */}
//         {/* <img
//           loading="lazy"
//           src={car.photos?.[0] || "placeholder.jpg"}
//           alt={car.model}
//           className={`w-full h-44 object-cover rounded-md transition-all duration-300 ${
//             loading ? "blur-sm scale-100" : "blur-0 scale-100"
//           }`}
//         /> */}
//         <picture>
//           <source srcSet={`${high} 2x, ${low} 1x`} type="image/webp" />
//           <img
//             src={low}
//             alt={car.model}
//             loading="lazy"
//             className="w-full h-56 object-cover rounded-md"
//           />
//         </picture>
//         {/* <picture>
//           <source
//             srcSet={`/images/cars/thumbnails/${car.id}_800x450.webp 2x, /images/cars/thumbnails/${car.id}_400x225.webp 1x`}
//             type="image/webp"
//           />
//           <img
//             src={`/images/cars/thumbnails/${car.id}_400x225.webp`}
//             alt={car.model}
//             loading="lazy"
//             className="w-full h-56 object-cover rounded-md"
//           />
//         </picture> */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_bottom_left,rgba(30,30,30,1)_0%,rgba(30,30,30,0)_15%,rgba(30,30,30,0)_100%)]"></div>
//         <span className="flex absolute top-2 right-2 text-white gap-1">
//           👁 {car.views.toLocaleString()}
//         </span>
//         <span className="px-4 flex flex-col">
//           <h3 className="text-lg font-bold mt-2">
//             {car.brand} {car.model}
//           </h3>
//           <p>Year: {car.year}</p>
//           <p>Engine: {car.fuelType}</p>
//           <p>Odometer: {car.odometer.toLocaleString()} km</p>
//           <p>Gearbox: {car.gearbox.charAt(0).toUpperCase() + car.gearbox.slice(1)}</p>
//         </span>
//       </div>
//     </Link>
//   );
// }

import { Link } from "react-router-dom";

export default function CarBox({ car }) {
  const thumbnailPaths = getThumbnailPaths(car.photos?.[0]);
  const low = thumbnailPaths?.low || "/placeholder.jpg";
  const high = thumbnailPaths?.high || "/placeholder.jpg";

  function getThumbnailPaths(photoUrl) {
    if (!photoUrl) return null;

    console.log("Thumbnail URL:", photoUrl);
    const pathMatch = photoUrl.match(/\/o\/(.+?)\?/);
    if (!pathMatch) return null;

    const decodedPath = decodeURIComponent(pathMatch[1]); // "cars/pic1.png"
    const parts = decodedPath.split("/"); // ["cars", "pic1.png"]
    if (parts.length < 2) return null;

    const fileName = parts[1]; // "pic1.png"
    const baseName = fileName.replace(/\.[^/.]+$/, ""); // "pic1"

    return {
      low: `/images/cars/thumbnails/${baseName}_400x225.webp`,
      high: `/images/cars/thumbnails/${baseName}_800x450.webp`,
    };
  }

  return (
    <Link to={`/details/${car.id}`}>
      <div
        key={car.id}
        className="relative rounded-lg shadow-lg pb-2 cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105 duration-300 bg-white text-black"
      >
        {/* Цена */}
        <span className="flex absolute bottom-1/3 right-2 bg-primary text-white px-2 py-1 rounded-md">
          <p>$ {car.price.toLocaleString()}</p>
        </span>

        {/* Снимка с <picture> */}
        <picture>
          <source srcSet={`${high} 2x, ${low} 1x`} type="image/webp" />
          <img
            src={low}
            alt={car.model}
            loading="lazy"
            className="w-full h-56 object-cover rounded-md"
          />
        </picture>

        {/* Градиентен overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_left,rgba(30,30,30,1)_0%,rgba(30,30,30,0)_15%,rgba(30,30,30,0)_100%)]"></div>

        {/* Брой гледания */}
        <span className="flex absolute top-2 right-2 text-white gap-1">
          👁 {car.views.toLocaleString()}
        </span>

        {/* Информация за колата */}
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
