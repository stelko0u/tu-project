import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop }) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      onDrop(acceptedFiles);
    },
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: true,
    maxFiles: 10,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full h-24 border-2 border-dashed border-gray-500 rounded-lg p-4 bg-white"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-md text-center">Drop the image here ...</p>
      ) : (
        <p className="text-md font-bold text-center">Drag 'n' drop or click to select images</p>
      )}
      {files.length > 0 && (
        <ul className="mt-4 text-base font-normal">
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropzone;
