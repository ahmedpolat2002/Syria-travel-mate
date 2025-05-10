"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../components/Map/Map"), {
  ssr: false, // <== تعطيل SSR
});

export default function MapPage() {
  return <Map />;
}
