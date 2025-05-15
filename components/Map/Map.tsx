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
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  isGovernorate?: boolean;
}

interface DynamicPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  typeName: string;
  provinceName: string;
}

interface Events {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  provinceName: string;
}

const MapWithSidebar: React.FC = () => {
  const [center, setCenter] = useState<[number, number]>([33.5138, 36.2765]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [filters, setFilters] = useState<string[]>([]);
  const [places, setPlaces] = useState<DynamicPlace[]>([]);
  const [events, setEvents] = useState<Events[]>([]);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPlaces = await fetch("/api/places");
        const resEvents = await fetch("/api/events");

        const dataPlaces = await resPlaces.json();
        const dataEvents = await resEvents.json();

        setPlaces(dataPlaces);
        setEvents(dataEvents);

        const resTypes = await fetch("/api/types");
        const dataTypes = await resTypes.json();

        const placeTypes = dataTypes.map((t: { name: string }) => t.name); // ← جلب الأنواع من الجدول مباشرة
        const eventTypes = ["فعالية"];
        setFilterOptions([...placeTypes, ...eventTypes]);
      } catch (err) {
        console.error("Failed to fetch map data:", err);
      }
    };
    fetchData();
  }, []);

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
          filterOptions={filterOptions}
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
            {/* ماركرات الأماكن */}
            {places
              .filter(
                (place) =>
                  filters.length === 0 || filters.includes(place.typeName)
              )

              .map((place) => (
                <Marker
                  key={place.id}
                  position={[place.latitude, place.longitude]}
                  icon={markerIcon}
                  eventHandlers={{
                    click: () =>
                      setSelectedLocation({
                        id: place.id.toString(),
                        name: place.name,
                        lat: place.latitude,
                        lng: place.longitude,
                        type: place.typeName,
                        isGovernorate: false,
                      }),
                  }}
                >
                  <Popup>
                    {place.name} ({place.typeName}) <br />
                    {place.provinceName}
                  </Popup>
                </Marker>
              ))}

            {events
              .filter(() => filters.length === 0 || filters.includes("فعالية"))
              .map((event) => (
                <Marker
                  key={`event-${event.id}`}
                  position={[event.latitude, event.longitude]}
                  icon={markerIcon}
                  eventHandlers={{
                    click: () =>
                      setSelectedLocation({
                        id: event.id.toString(),
                        name: event.title,
                        lat: event.latitude,
                        lng: event.longitude,
                        type: "فعالية",
                        isGovernorate: false,
                      }),
                  }}
                >
                  <Popup>
                    {event.title} <br />
                    {event.provinceName}
                  </Popup>
                </Marker>
              ))}
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
