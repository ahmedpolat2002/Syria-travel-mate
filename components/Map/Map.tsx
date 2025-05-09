"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

// أيقونة الماركر
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

interface Location {
  name: string;
  lat: number;
  lng: number;
  type: "مطعم" | "فندق" | "حديقة";
  isGovernorate?: boolean;
}

interface Governorate {
  name: string;
  lat: number;
  lng: number;
}

const governorates: Governorate[] = [
  { name: "دمشق", lat: 33.5138, lng: 36.2765 },
  { name: "ريف دمشق", lat: 33.5167, lng: 36.8667 },
  { name: "القنيطرة", lat: 33.1258, lng: 35.8245 },
  { name: "درعا", lat: 32.6257, lng: 36.106 },
  { name: "السويداء", lat: 32.704, lng: 36.5649 },
  { name: "حمص", lat: 34.7314, lng: 36.7096 },
  { name: "حماة", lat: 35.1318, lng: 36.754 },
  { name: "طرطوس", lat: 34.889, lng: 35.8866 },
  { name: "اللاذقية", lat: 35.5196, lng: 35.7915 },
  { name: "إدلب", lat: 35.9306, lng: 36.6339 },
  { name: "حلب", lat: 36.2021, lng: 37.1343 },
  { name: "الرقة", lat: 35.9594, lng: 39.0078 },
  { name: "دير الزور", lat: 35.3356, lng: 40.1406 },
];

const locationData: { [govName: string]: Location[] } = {
  دمشق: [
    { name: "مطعم السلام", lat: 33.5135, lng: 36.277, type: "مطعم" },
    { name: "فندق الشام", lat: 33.5142, lng: 36.2768, type: "فندق" },
    { name: "حديقة تشرين", lat: 33.512, lng: 36.275, type: "حديقة" },
  ],
  حلب: [
    { name: "مطعم الحلابي", lat: 36.204, lng: 37.133, type: "مطعم" },
    { name: "فندق القلعة", lat: 36.203, lng: 37.135, type: "فندق" },
    { name: "حديقة السبيل", lat: 36.205, lng: 37.134, type: "حديقة" },
  ],
  حمص: [
    { name: "مطعم البستان", lat: 34.732, lng: 36.71, type: "مطعم" },
    { name: "فندق حمص الكبير", lat: 34.731, lng: 36.709, type: "فندق" },
    { name: "حديقة المستقبل", lat: 34.733, lng: 36.711, type: "حديقة" },
  ],
};

const MapWithSidebar: React.FC = () => {
  const [center, setCenter] = useState<[number, number]>([33.5138, 36.2765]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [filters, setFilters] = useState<string[]>([]);

  const handleFilterChange = (newFilters: string[]) => {
    setFilters(newFilters);
  };

  const handleLocationClick = (lat: number, lng: number) => {
    setCenter([lat, lng]);
    setSelectedLocation(null);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Sidebar
          onLocationClick={handleLocationClick}
          selectedLocation={selectedLocation}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <div className={styles.map}>
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <SetViewOnClick position={center} />
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* ماركرات المحافظات */}
            {governorates.map((gov) => (
              <Marker
                key={gov.name}
                position={[gov.lat, gov.lng]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => {
                    setCenter([gov.lat, gov.lng]);
                    setSelectedLocation({
                      name: gov.name,
                      lat: gov.lat,
                      lng: gov.lng,
                      type: "حديقة", // قيمة مؤقتة فقط
                      isGovernorate: true,
                    });
                  },
                }}
              >
                <Popup>{gov.name}</Popup>
              </Marker>
            ))}

            {/* ماركرات الأماكن حسب الفلتر */}
            {governorates.map((gov) =>
              (locationData[gov.name] || [])
                .filter(
                  (loc) => filters.length === 0 || filters.includes(loc.type)
                )
                .map((loc) => (
                  <Marker
                    key={loc.name}
                    position={[loc.lat, loc.lng]}
                    icon={markerIcon}
                    eventHandlers={{
                      click: () =>
                        setSelectedLocation({ ...loc, isGovernorate: false }),
                    }}
                  >
                    <Popup>
                      {loc.name} ({loc.type})
                    </Popup>
                  </Marker>
                ))
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapWithSidebar;

interface SetViewProps {
  position: [number, number];
}

function SetViewOnClick({ position }: SetViewProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  console.log("Map position set to:", position);
  return null;
}
