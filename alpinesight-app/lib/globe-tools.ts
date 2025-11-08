/**
 * Globe Control Tools
 *
 * This module provides tools for the AI to control the globe visualization.
 * The AI can use these tools to show locations, add markers, and control the camera.
 */

export interface GeocodingResult {
  name: string;
  lat: number;
  lng: number;
  boundingBox?: number[];
}

/**
 * Geocode a location string to coordinates
 */
export async function geocodeLocation(
  location: string
): Promise<GeocodingResult> {
  const response = await fetch(
    `/api/globe/geocode?location=${encodeURIComponent(location)}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to geocode location");
  }

  return response.json();
}

/**
 * Tool definitions for the AI to use in the chat API
 */
export const globeTools = [
  {
    type: "function" as const,
    function: {
      name: "show_location_on_globe",
      description:
        "Shows a location on the interactive globe with a marker and zooms the camera to that location. Opens the globe if it's not already open. Use this when the user asks to find, show, or locate a place on the map.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description:
              "The name of the location to show (e.g., 'Istanbul', 'Paris', 'Mount Everest', 'Golden Gate Bridge')",
          },
          markerColor: {
            type: "string",
            description: "The color of the marker pin (default: 'red')",
            enum: ["red", "blue", "green", "orange", "purple"],
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "close_globe",
      description:
        "Closes the globe view and returns to full-screen chat. Use this when the user is done viewing the map or asks to close it.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

/**
 * Type for tool calls
 */
export type GlobeToolCall =
  | {
      name: "show_location_on_globe";
      arguments: {
        location: string;
        markerColor?: "red" | "blue" | "green" | "orange" | "purple";
      };
    }
  | {
      name: "close_globe";
      arguments: Record<string, never>;
    };
