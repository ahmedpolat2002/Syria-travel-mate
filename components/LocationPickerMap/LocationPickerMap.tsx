"use client";

import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  onSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number]; // optional pre-filled marker
}

export default function LocationPickerMap({
  onSelect,
  initialPosition,
}: Props) {
  const [position, setPosition] = useState<[number, number]>(
    initialPosition || [33.5138, 36.2765] // دمشق
  );

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler
        onClick={(lat, lng) => {
          setPosition([lat, lng]);
          onSelect(lat, lng);
        }}
      />
      <Marker position={position} icon={markerIcon} />
    </MapContainer>
  );
}

function MapClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvent("click", (e) => {
    onClick(e.latlng.lat, e.latlng.lng);
  });
  return null;
}
