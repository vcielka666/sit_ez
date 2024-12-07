"use client";
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdPhone } from "react-icons/md"; // Contact icon
import { FiGlobe } from "react-icons/fi"; // Website icon
import { FiShare2 } from "react-icons/fi"; // Share ic


const MoreDetailsComponent = ({ place, onBack }: { place: any; onBack: () => void }) => {
  if (!place) return null;

  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* Render the first image */}
      {place.pictureUrls && place.pictureUrls.length > 0 && (
        <div className="w-full h-64">
          <img
            src={place.pictureUrls[2]}
            alt={`Image of ${place.name}`}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="p-2">
        <h1 className="text-2xl font-bold left-0">{place.name}</h1>
        <div className="mt-4 space-y-2">
        <div className="text-lg font-semibold flex items-center justify-start">
    <span className=" flex text-yellow-500">
      <FaStar />
      <FaStar />
      <FaStar />
      <FaStarHalfAlt />
      <FaRegStar />
    </span>
    <span className="ml-2 text-gray-600">(3.5)</span>
    
    <div className="text-lg font-semibold flex items-center">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <span className="text-gray-600">
              {place.distance ? `${place.distance.toFixed(2)} km` : "Distance not available"}
            </span>
          </div>
  </div>
  <div className="mt-4 space-y-2">
  <p className="text-lg font-semibold flex items-center">
    <FaClock className="text-gray-500 mr-2" />
    <span className="ml-2 text-gray-600">8 AM - 10 PM</span>
  </p>
</div>

        </div>
        <p className="text-gray-700 mt-2">{place.description || "No description available."}</p>

        <div className="flex justify-around mt-4">
        <div className="flex flex-col items-center">
          <button
            className="flex items-center gap-2 px-2 py-2 bg-purple-500 text-white rounded-full shadow hover:bg-blue-600"
          >
            <MdPhone className="text-xl" />
          </button>
          <p>Contact</p>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="flex items-center gap-2 px-2 py-2 bg-purple-500 text-white rounded-full shadow hover:bg-green-600"
          >
            <FiGlobe className="text-xl" />
          </button>
          <p>Website</p>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="flex items-center gap-2 px-2 py-2 bg-purple-500 text-white rounded-full shadow hover:bg-purple-600"
          >
            <FiShare2 className="text-xl" />
          </button>
          <p>Share</p>
        </div>
      </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Reservations</h2>
          <p>Reservation system work in progress!</p>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Reviews</h2>
          <p>No reviews yet. Be the first to leave one!</p>
        </div>

        <button
          onClick={onBack}
          className="mt-8 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MoreDetailsComponent;
