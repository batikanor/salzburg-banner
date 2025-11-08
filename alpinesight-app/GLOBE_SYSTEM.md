# Globe Control System Documentation

## Overview

This application features a professional AI-driven globe control system that allows the AI assistant to intelligently show locations, add markers, and control the camera view in response to user requests.

## Architecture

### 1. **Frontend Components**

#### Globe Context (`contexts/globe-context.tsx`)
- Centralized state management for globe visibility, markers, and camera position
- Provides hooks for controlling the globe from anywhere in the app
- Manages marker lifecycle (add, clear, update)
- Handles camera positioning with smooth animations

**Key Functions:**
- `setIsGlobeOpen(boolean)` - Open/close the globe
- `addMarker(GlobeMarker)` - Add a location marker
- `clearMarkers()` - Remove all markers
- `flyToLocation(lat, lng, altitude)` - Animate camera to location

#### Globe Modal (`components/globe-modal.tsx`)
- Interactive 3D globe using react-globe.gl and Three.js
- Supports HTML markers with custom styling
- Smooth camera transitions (2 second animations)
- Auto-rotation when idle
- OpenStreetMap tile integration

#### Chat Component (`components/chat.tsx`)
- Integrates with AI SDK to handle tool calls
- Executes globe control actions based on AI decisions
- Provides user feedback via toast notifications
- Automatically geocodes location names to coordinates

### 2. **Backend API**

#### Globe Tools (`api/utils/tools.py`)
The AI has access to these tools:

**`show_location_on_globe`**
- **Purpose:** Display a location on the globe with a marker
- **When to use:** User asks to find, show, locate, or view a place
- **Parameters:**
  - `location` (required): Name of the place (e.g., "Istanbul", "Eiffel Tower")
  - `markerColor` (optional): Color of the marker pin (red, blue, green, orange, purple)
- **Behavior:**
  1. Opens globe if closed
  2. Geocodes location to coordinates
  3. Adds colored marker
  4. Smoothly flies camera to location
  5. Shows success notification

**`close_globe`**
- **Purpose:** Close the globe view
- **When to use:** Conversation shifts away from geography or user requests it
- **Parameters:** None
- **Behavior:**
  1. Closes globe panel
  2. Clears all markers
  3. Returns to full-screen chat

#### Geocoding Service (`app/api/globe/geocode/route.ts`)
- Uses OpenStreetMap Nominatim API
- Converts location names to coordinates
- Returns formatted location data with bounding boxes
- Handles errors gracefully

### 3. **Tool Integration**

#### How Tools Work

```
User Input → AI Model → Tool Decision → Frontend Execution → Visual Feedback
```

**Example Flow:**
```
User: "Find Istanbul"
  ↓
AI recognizes geographic intent
  ↓
AI calls: show_location_on_globe({ location: "Istanbul" })
  ↓
Frontend geocodes "Istanbul" → { lat: 41.0082, lng: 28.9784 }
  ↓
Globe opens, marker appears, camera flies to location
  ↓
User sees Istanbul on the globe
```

## Workflow Examples

### Example 1: Simple Location Request
```
User: "Show me Tokyo"

AI Action:
1. Calls show_location_on_globe({ location: "Tokyo", markerColor: "red" })

Result:
- Globe opens (if closed)
- Red marker appears on Tokyo
- Camera zooms to Tokyo (lat: 35.6762, lng: 139.6503)
- Toast notification: "Showing Tokyo, Japan on the globe"
```

### Example 2: Multiple Locations
```
User: "Show me Paris and then New York"

AI Action:
1. Calls show_location_on_globe({ location: "Paris" })
2. Responds about Paris
3. Calls show_location_on_globe({ location: "New York" })

Result:
- Globe shows Paris first with marker
- Then flies to New York with another marker
- Both markers remain visible
```

### Example 3: Conversation Context
```
User: "Find Istanbul"
AI: *Shows Istanbul on globe*

User: "What's the weather there?"
AI: *Calls get_current_weather with Istanbul coordinates*

User: "Thanks, I'm done"
AI: *Calls close_globe*

Result:
- Globe closes automatically
- Markers cleared
- Back to full-screen chat
```

## AI Behavior Guidelines

### When to Use `show_location_on_globe`

**✅ DO use when:**
- User asks to "find", "show", "locate", "display" a place
- Geographic questions like "Where is X?"
- Travel planning discussions
- Comparing locations geographically
- User wants to visualize a place

**❌ DON'T use when:**
- Just mentioning a place name in conversation
- User asks about non-geographic facts about a place
- No visual context would help

### When to Use `close_globe`

**✅ DO use when:**
- Conversation shifts to non-geographic topics
- User explicitly asks to close the map
- Series of location requests is complete
- User asks a new question unrelated to geography

**❌ DON'T use when:**
- Still discussing geographic topics
- User might want to see more locations
- In the middle of showing multiple places

## Technical Features

### Smooth Animations
- **Camera transitions:** 2000ms smooth interpolation
- **Panel animations:** Spring physics (stiffness: 300, damping: 30)
- **Marker transitions:** 1000ms fade in/out
- **Globe rotation:** Auto-rotate at 0.5 speed when idle

### Marker System
- **HTML-based markers:** Scalable SVG pins
- **Custom colors:** 5 color options (red, blue, green, orange, purple)
- **Tooltips:** Location names on hover
- **Persistent:** Markers remain until explicitly cleared

### Error Handling
- **Location not found:** Graceful error message via toast
- **API failures:** Fallback error handling
- **Network issues:** Timeout and retry logic

## Configuration

### Environment Variables
No additional environment variables needed for globe features. Uses OpenStreetMap's free Nominatim API.

### Customization
Edit `components/globe-modal.tsx` to customize:
- Globe textures
- Marker styles
- Animation speeds
- Camera defaults
- Tile providers

## Performance Considerations

1. **Dynamic Import:** Globe component uses Next.js dynamic import to avoid SSR issues
2. **Lazy Loading:** Three.js only loads when globe is opened
3. **Debouncing:** Camera movements are optimized to prevent jank
4. **Marker Limits:** Consider limiting to ~50 markers for performance

## Future Enhancements

Potential additions:
- Route drawing between locations
- Location clustering for multiple nearby points
- 3D building overlays
- Custom marker icons per location type
- Save/load marker sets
- Export globe view as image
- Elevation data visualization

## Troubleshooting

### Globe won't open
- Check browser console for Three.js errors
- Ensure WebGL is supported and enabled
- Try clearing browser cache

### Location not found
- Use more specific names (e.g., "Paris, France" vs "Paris")
- Check spelling
- Try alternate names (e.g., "Istanbul" vs "Constantinople")

### Markers not appearing
- Ensure coordinates are valid (-90 to 90 lat, -180 to 180 lng)
- Check browser console for rendering errors
- Verify marker data structure matches GlobeMarker interface

## Code Examples

### Manually Show Location (for testing)
```typescript
import { useGlobe } from '@/contexts/globe-context';

function MyComponent() {
  const { setIsGlobeOpen, addMarker, flyToLocation } = useGlobe();

  const showParis = () => {
    setIsGlobeOpen(true);
    addMarker({
      id: 'paris',
      lat: 48.8566,
      lng: 2.3522,
      label: 'Paris, France',
      color: 'blue',
      size: 35
    });
    flyToLocation(48.8566, 2.3522, 1.5);
  };

  return <button onClick={showParis}>Show Paris</button>;
}
```

### Custom Geocoding
```typescript
import { geocodeLocation } from '@/lib/globe-tools';

const result = await geocodeLocation('Mount Everest');
// { name: "Mount Everest, ...", lat: 27.988056, lng: 86.925278 }
```

## Summary

This system provides a seamless, professional integration between AI conversation and geographic visualization. The AI can intelligently control the globe based on conversation context, providing users with an intuitive way to explore locations through natural language.

**Key Benefits:**
- ✅ Natural language location requests
- ✅ Automatic globe control by AI
- ✅ Smooth, professional animations
- ✅ Context-aware tool usage
- ✅ Error-resistant with graceful fallbacks
- ✅ No manual UI interaction required for basic operations
