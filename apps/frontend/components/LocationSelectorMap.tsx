"use client";

import { MapContainer, Marker, TileLayer, useMapEvent } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const farmerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41]
});

interface LocationSelectorMapProps {
  latitude?: number;
  longitude?: number;
  onSelect: (lat: number, lon: number) => void;
}

function MapClickHandler({
  onSelect
}: {
  onSelect: (lat: number, lon: number) => void;
}) {
  useMapEvent("click", (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    onSelect(lat, lng);
  });
  return null;
}

export default function LocationSelectorMap({
  latitude,
  longitude,
  onSelect
}: LocationSelectorMapProps) {
  const position: [number, number] = [
    latitude ?? 20.5937,
    longitude ?? 78.9629
  ];

  return (
    <MapContainer
      center={position}
      zoom={latitude && longitude ? 9 : 5}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onSelect={onSelect} />
      {latitude && longitude && (
        <Marker position={[latitude, longitude]} icon={farmerIcon} />
      )}
    </MapContainer>
  );
}

