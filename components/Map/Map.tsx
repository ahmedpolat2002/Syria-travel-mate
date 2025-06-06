"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
  // Tooltip,
} from "react-leaflet";
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

// أيقونة المحافظة https://icons8.com/icon/13800/location
const governorateIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/?size=200&id=13800&format=png&color=dddddd",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
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
  safetyStatus: "safe" | "warning" | "danger";
}

interface Events {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  provinceName: string;
}

const dangerOptions = { color: "red", fillColor: "red", fillOpacity: 0.5 };
const warningOptions = {
  color: "orange",
  fillColor: "orange",
  fillOpacity: 0.5,
};

const MapWithSidebar: React.FC = () => {
  const [center, setCenter] = useState<[number, number]>([33.5138, 36.2765]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [filters, setFilters] = useState<string[]>([]);
  const [places, setPlaces] = useState<DynamicPlace[]>([]);
  const [events, setEvents] = useState<Events[]>([]);
  const [governorates, setGovernorates] = useState<Location[]>([]);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const res = await fetch("/api/provinces");
        const data = await res.json();

        interface Province {
          id: number;
          name: string;
          latitude: number;
          longitude: number;
        }
        const formatted = data.map((item: Province) => ({
          id: item.id.toString(),
          name: item.name,
          lat: item.latitude,
          lng: item.longitude,
          type: "محافظة",
          isGovernorate: true,
        }));
        setGovernorates(formatted);
      } catch (err) {
        console.error("Failed to fetch provinces:", err);
      }
    };
    fetchGovernorates();
  }, []);

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
          governorates={governorates}
        />

        <div className={styles.map}>
          <MapContainer
            center={center}
            zoom={8}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <SetViewOnClick position={center} />
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {governorates.map((gov) => (
              <Marker
                key={`gov-${gov.id}`}
                position={[gov.lat, gov.lng]}
                icon={governorateIcon}
                eventHandlers={{
                  click: () => setSelectedLocation(gov),
                }}
              >
                <Popup>{gov.name} (محافظة)</Popup>
              </Marker>
            ))}

            {places
              .filter(
                (place) =>
                  filters.length === 0 || filters.includes(place.typeName)
              )
              .map((place) => {
                const isDanger = place.safetyStatus === "danger";
                const isWarning = place.safetyStatus === "warning";

                // إظهار الدوائر لـ danger و warning
                if (isDanger || isWarning) {
                  return (
                    <CircleMarker
                      key={`circle-${place.id}`}
                      center={[place.latitude, place.longitude]}
                      pathOptions={isDanger ? dangerOptions : warningOptions}
                      radius={15}
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
                        {place.name} ({place.typeName})
                      </Popup>
                    </CircleMarker>
                  );
                }

                // باقي الحالات تعرض كمؤشر عادي
                return (
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
                );
              })}

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
