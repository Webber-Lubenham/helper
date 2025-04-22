import { supabase } from "../../supabase/supabase";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
  studentId: string;
}

/**
 * Send the student's location to the database
 * @param locationData The location data to send
 * @returns A promise that resolves when the location is sent
 */
export const sendLocationToResponsibles = async (
  locationData: LocationData,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from("student_locations").insert([
      {
        student_id: locationData.studentId,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy || null,
        timestamp: new Date(locationData.timestamp).toISOString(),
      },
    ]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error sending location:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error sending location",
    };
  }
};

/**
 * Get the latest location for a student
 * @param studentId The ID of the student
 * @returns The latest location data
 */
export const getLatestLocation = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from("student_locations")
      .select("*")
      .eq("student_id", studentId)
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error getting latest location:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error getting location",
      data: null,
    };
  }
};
