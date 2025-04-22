import React, { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import DashboardGrid from "../dashboard/DashboardGrid";
import TaskBoard from "../dashboard/TaskBoard";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../../supabase/auth";
import { sendLocationToResponsibles } from "@/services/locationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Replace this
// import Map from "@/components/Map";
// with
import MapComponent from "@/components/Map";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  error: string | null;
  permissionStatus: PermissionState | null;
  isSending: boolean;
  lastSentTime: number | null;
  sendingError: string | null;
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [locationState, setLocationState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    error: null,
    permissionStatus: null,
    isSending: false,
    lastSentTime: null,
    sendingError: null,
  });

  // Function to trigger loading state for demonstration
  const handleRefresh = () => {
    setLoading(true);
    // Reset loading after 2 seconds
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  // Request location permission and get current position
  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        error: "Geolocalização não é suportada pelo seu navegador.",
      }));
      return;
    }

    try {
      // Check if we need to request permission
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      setLocationState((prev) => ({
        ...prev,
        permissionStatus: permissionStatus.state,
      }));

      if (permissionStatus.state === "denied") {
        setLocationState((prev) => ({
          ...prev,
          error:
            "Permissão para acessar sua localização foi negada. Por favor, habilite o acesso à localização nas configurações do seu navegador.",
        }));
        return;
      }

      // Get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationState((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            error: null,
          }));
        },
        (error) => {
          let errorMessage = "Erro ao obter localização.";
          if (error.code === 1) {
            errorMessage = "Permissão para acessar sua localização foi negada.";
          } else if (error.code === 2) {
            errorMessage = "Localização indisponível.";
          } else if (error.code === 3) {
            errorMessage = "Tempo esgotado ao tentar obter localização.";
          }

          setLocationState((prev) => ({
            ...prev,
            error: errorMessage,
          }));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } catch (error) {
      setLocationState((prev) => ({
        ...prev,
        error: "Erro ao solicitar permissão de localização.",
      }));
    }
  };

  // Send location to responsibles
  const sendLocation = async () => {
    if (
      !user ||
      !locationState.latitude ||
      !locationState.longitude ||
      !locationState.timestamp
    ) {
      setLocationState((prev) => ({
        ...prev,
        sendingError: "Dados de localização incompletos.",
      }));
      return;
    }

    setLocationState((prev) => ({
      ...prev,
      isSending: true,
      sendingError: null,
    }));

    try {
      const result = await sendLocationToResponsibles({
        latitude: locationState.latitude,
        longitude: locationState.longitude,
        accuracy: locationState.accuracy || undefined,
        timestamp: locationState.timestamp,
        studentId: user.id,
      });

      if (result.success) {
        setLocationState((prev) => ({
          ...prev,
          isSending: false,
          lastSentTime: Date.now(),
          sendingError: null,
        }));
      } else {
        setLocationState((prev) => ({
          ...prev,
          isSending: false,
          sendingError: result.error || "Erro ao enviar localização.",
        }));
      }
    } catch (error) {
      setLocationState((prev) => ({
        ...prev,
        isSending: false,
        sendingError:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao enviar localização.",
      }));
    }
  };

  // Request location permission on component mount
  useEffect(() => {
    requestLocationPermission();

    // Set up a timer to update location every minute
    const intervalId = setInterval(() => {
      requestLocationPermission();
    }, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 pt-4 pb-2 flex justify-between">
            <Button
              onClick={requestLocationPermission}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors flex items-center gap-2"
              disabled={locationState.isSending}
            >
              <MapPin className="h-4 w-4" />
              Atualizar Localização
            </Button>
            <Button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh Dashboard"}
            </Button>
          </div>

          {locationState.error && (
            <div className="container mx-auto px-6 pt-2">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro de Localização</AlertTitle>
                <AlertDescription>{locationState.error}</AlertDescription>
              </Alert>
            </div>
          )}

          {locationState.latitude && locationState.longitude && (
            <div className="container mx-auto px-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium text-gray-900">
                    Sua Localização Atual
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Latitude:{" "}
                      {locationState.latitude
                        ? locationState.latitude.toFixed(6)
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Longitude:{" "}
                      {locationState.longitude
                        ? locationState.longitude.toFixed(6)
                        : "N/A"}
                    </p>
                    {locationState.accuracy && (
                      <p className="text-sm text-gray-500">
                        Precisão: {locationState.accuracy.toFixed(2)} metros
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Última atualização:{" "}
                      {locationState.timestamp
                        ? new Date(locationState.timestamp).toLocaleTimeString()
                        : "N/A"}
                    </p>

                    <div className="pt-2">
                      <Button
                        onClick={sendLocation}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={
                          locationState.isSending || !locationState.latitude
                        }
                      >
                        {locationState.isSending
                          ? "Enviando..."
                          : "Enviar Localização para Responsáveis"}
                      </Button>

                      {locationState.lastSentTime && (
                        <p className="text-xs text-green-600 mt-2">
                          Última localização enviada:{" "}
                          {new Date(
                            locationState.lastSentTime,
                          ).toLocaleTimeString()}
                        </p>
                      )}

                      {locationState.sendingError && (
                        <p className="text-xs text-red-600 mt-2">
                          Erro ao enviar: {locationState.sendingError}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mapa com a localização do aluno */}
              <MapComponent
                latitude={locationState.latitude}
                longitude={locationState.longitude}
                className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm h-full"
              />
            </div>
          )}

          <div
            className={cn(
              "container mx-auto p-6 space-y-8",
              "transition-all duration-300 ease-in-out",
            )}
          >
            <DashboardGrid isLoading={loading} />
            <TaskBoard isLoading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
