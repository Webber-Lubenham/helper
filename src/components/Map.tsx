import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

// Safe environment variables configuration
const ENV = {
  MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_TOKEN || "",
  MAPBOX_STYLE_URL:
    import.meta.env.VITE_MAPBOX_STYLE_URL ||
    "mapbox://styles/mapbox/streets-v12",
  MAPBOX_INITIAL_CENTER: import.meta.env.VITE_MAPBOX_INITIAL_CENTER
    ? import.meta.env.VITE_MAPBOX_INITIAL_CENTER.split(",").map(Number)
    : [-23.5489, -46.6388], // São Paulo as default
};

interface MapProps {
  latitude: number | null;
  longitude: number | null;
  zoom?: number;
  className?: string;
}

const MapComponent: React.FC<MapProps> = ({
  latitude,
  longitude,
  zoom = 15,
  className = "",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;
    if (!ENV.MAPBOX_TOKEN) {
      console.error("Mapbox token is not defined");
      return;
    }

    // Set mapbox token
    mapboxgl.accessToken = ENV.MAPBOX_TOKEN;

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: ENV.MAPBOX_STYLE_URL,
      center: [ENV.MAPBOX_INITIAL_CENTER[1], ENV.MAPBOX_INITIAL_CENTER[0]], // [lng, lat]
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "top-right",
    );

    map.current.on("load", () => {
      setMapInitialized(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (marker.current) {
        marker.current = null;
      }
    };
  }, [zoom]);

  // Update marker when latitude or longitude changes
  useEffect(() => {
    if (!map.current || !mapInitialized || !latitude || !longitude) return;

    // Create or update marker
    if (!marker.current) {
      marker.current = new mapboxgl.Marker({ color: "#3b82f6" })
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    } else {
      marker.current.setLngLat([longitude, latitude]);
    }

    // Fly to location
    map.current.flyTo({
      center: [longitude, latitude],
      zoom: zoom,
      essential: true,
    });
  }, [latitude, longitude, mapInitialized, zoom]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-gray-900">
          Localização no Mapa
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
          <MapPin className="h-4 w-4 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={mapContainer}
          className="w-full h-[300px] rounded-b-xl"
          style={{ border: "none" }}
        />
        {!latitude || !longitude ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-b-xl">
            <p className="text-gray-500">Aguardando localização...</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default MapComponent;
