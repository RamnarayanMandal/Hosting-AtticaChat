import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { IoIosCloseCircleOutline } from "react-icons/io";

const CloseButton = ({ onClose }) => {
  const map = useMap();
  
  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control">
        <IoIosCloseCircleOutline
          className="text-4xl text-red-500 bg-white cursor-pointer m-2"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

const GoogleMapComponent = ({ locations, onClose }) => {
  const position = [locations[0].latitude, locations[0].longitude]; // Use the first location as the starting point
  const polyline = locations.map(location => [location.latitude, location.longitude]); // Map locations to polyline coordinates

  return (
    <div className="relative h-screen w-full border-2 border-[#5443c3]">
      <MapContainer center={position} zoom={13} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} />
        <Polyline positions={polyline} color="blue" />
        <CloseButton onClose={onClose} />
      </MapContainer>
    </div>
  );
};

export default GoogleMapComponent;
