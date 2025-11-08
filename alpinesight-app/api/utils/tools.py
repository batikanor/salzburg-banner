import requests


def get_current_weather(latitude, longitude):
    # Format the URL with proper parameter substitution
    url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto"

    try:
        # Make the API call
        response = requests.get(url)

        # Raise an exception for bad status codes
        response.raise_for_status()

        # Return the JSON response
        return response.json()

    except requests.RequestException as e:
        # Handle any errors that occur during the request
        print(f"Error fetching weather data: {e}")
        return None


def show_location_on_globe(location: str, markerColor: str = "red"):
    """
    Shows a location on the interactive globe with a marker.
    ALWAYS call this tool for EVERY new user request to show/find/locate/display a place, even if the globe is already open or another location was just shown. Do NOT just respond with text like "with a blue marker"—you must invoke this tool so the frontend can update the globe.
    You can change marker colors if the user asks (red, blue, green, orange, purple).
    Returns a confirmation for the AI.
    """
    return {
        "status": "success",
        "action": "displayed_location",
        "location": location,
        "marker_color": markerColor,
        "message": f"Opened interactive globe and displayed {location} with {markerColor} marker"
    }


def close_globe():
    """
    Closes the globe view.
    This is a client-side tool that will be handled by the frontend.
    Return a confirmation so the AI knows the action succeeded.
    """
    return {
        "status": "success",
        "action": "closed_globe",
        "message": "Closed the globe view"
    }


def get_satellite_timeline(location: str, latitude: float, longitude: float):
    """
    Retrieves historical satellite imagery timeline for a specific location.
    ALWAYS call this tool when the user asks for satellite images, historical imagery, wayback imagery, maps over time, changes over time, or anything similar – EVEN IF the interactive globe is currently open or was just used. The frontend will automatically close the globe and display the timeline.
    If the user provides coordinates (e.g. "48.8584 N, 2.2945 E"), extract them and call this tool. Do not attempt to answer with a description only; the user expects the imagery viewer.
    """
    return {
        "status": "success",
        "action": "show_satellite_timeline",
        "location": location,
        "latitude": latitude,
        "longitude": longitude,
        "message": f"Fetching satellite imagery timeline for {location}"
    }


TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "Get the current weather at a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "latitude": {
                        "type": "number",
                        "description": "The latitude of the location",
                    },
                    "longitude": {
                        "type": "number",
                        "description": "The longitude of the location",
                    },
                },
                "required": ["latitude", "longitude"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "show_location_on_globe",
            "description": "Shows a location on the interactive 3D globe with a marker and zooms to it. ALWAYS call for each new location request even if the globe is open already. Examples: 'show me Paris', 'find Big Ben', 'locate Mount Everest'. IMPORTANT: Each call replaces previous markers (they are cleared). Marker colors allowed: red, blue, green, orange, purple.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The name of the location to show (e.g., 'Istanbul', 'Paris', 'Mount Everest', 'Golden Gate Bridge')",
                    },
                    "markerColor": {
                        "type": "string",
                        "description": "The color of the marker pin",
                        "enum": ["red", "blue", "green", "orange", "purple"],
                        "default": "red"
                    },
                },
                "required": ["location"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "close_globe",
            "description": "Closes the globe view, clears all markers, and returns to full-screen chat. Use when the user explicitly asks to close or changes topic away from locations.",
            "parameters": {
                "type": "object",
                "properties": {},
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_satellite_timeline",
            "description": "Retrieves and displays historical satellite imagery timeline for a specific location using ESRI Wayback imagery archive. ALWAYS call this tool for requests about satellite/historical imagery even if the globe is open. If coordinates are present, parse them.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The name or address of the location (e.g., 'Eiffel Tower', 'Central Park, New York')",
                    },
                    "latitude": {
                        "type": "number",
                        "description": "Latitude in decimal degrees",
                    },
                    "longitude": {
                        "type": "number",
                        "description": "Longitude in decimal degrees",
                    },
                },
                "required": ["location", "latitude", "longitude"],
            },
        },
    },
]


AVAILABLE_TOOLS = {
    "get_current_weather": get_current_weather,
    "show_location_on_globe": show_location_on_globe,
    "close_globe": close_globe,
    "get_satellite_timeline": get_satellite_timeline,
}
