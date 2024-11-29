import React from "react";

interface MarkerDetailsProps {
  place: {
    name: string;
    latitude: number;
    longitude: number;
    createdAt?: string;
  };
  onClose: () => void; // Callback to close the details
}

const MarkerDetails: React.FC<MarkerDetailsProps> = ({ place, onClose }) => {
    return (
      <div className="p-4 border rounded shadow-md bg-white max-w-md relative">
        <button
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-lg font-bold mb-2">{place.name}</h2>
        <p className="text-sm text-gray-600">
          Coordinates: <span className="font-mono">{place.latitude}, {place.longitude}</span>
        </p>
        {place.createdAt && (
          <p className="text-sm text-gray-600">
            Added on: <span>{new Date(place.createdAt).toLocaleDateString()}</span>
          </p>
        )}
      </div>
    );
  };
  

export default MarkerDetails;
