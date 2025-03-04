"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { motion } from "framer-motion"

// Sample data (replace with your actual data)
const locations = [
  {
    name: "New York",
    coordinates: [-74.006, 40.7128],
    memories: [
      { id: 1, title: "First Job", year: "1995", image: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Family Vacation", year: "2005", image: "/placeholder.svg?height=200&width=300" },
    ],
  },
  {
    name: "Paris",
    coordinates: [2.3522, 48.8566],
    memories: [{ id: 3, title: "Honeymoon", year: "1990", image: "/placeholder.svg?height=200&width=300" }],
  },
  // ... more locations
]

export default function WorldMap() {
  const [selectedLocation, setSelectedLocation] = useState<(typeof locations)[0] | null>(null)

  return (
    <div className="relative">
      <ComposableMap projection="geoMercator">
        <Geographies geography="/path-to-world-map.json">
          {({ geographies }) =>
            geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />)
          }
        </Geographies>
        {locations.map((location) => (
          <Marker key={location.name} coordinates={location.coordinates}>
            <circle
              r={5}
              fill="#F00"
              stroke="#fff"
              strokeWidth={2}
              onClick={() => setSelectedLocation(location)}
              style={{ cursor: "pointer" }}
            />
          </Marker>
        ))}
      </ComposableMap>
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm"
        >
          <h3 className="text-xl font-bold mb-2">{selectedLocation.name}</h3>
          <div className="space-y-4">
            {selectedLocation.memories.map((memory) => (
              <div key={memory.id} className="flex items-center space-x-4">
                <img
                  src={memory.image || "/placeholder.svg"}
                  alt={memory.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold">{memory.title}</h4>
                  <p className="text-sm text-gray-600">{memory.year}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-blue-600 hover:underline" onClick={() => setSelectedLocation(null)}>
            Close
          </button>
        </motion.div>
      )}
    </div>
  )
}

