"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample data (replace with your actual data)
const memories = [
  {
    id: 1,
    year: "1970",
    title: "Childhood",
    description: "The early years in hometown",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/path-to-audio-file-1.mp3",
    location: { lat: 40.7128, lng: -74.006 },
  },
  // ... more memories
]

export default function InfiniteMemoryScroll() {
  const [visibleMemories, setVisibleMemories] = useState(memories.slice(0, 5))
  const [loading, setLoading] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)
  const lastMemoryRef = useRef<HTMLDivElement>(null)

  const loadMoreMemories = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const nextIndex = visibleMemories.length
      const newMemories = memories.slice(nextIndex, nextIndex + 5)
      setVisibleMemories([...visibleMemories, ...newMemories])
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreMemories()
        }
      },
      { threshold: 1 },
    )

    if (lastMemoryRef.current) {
      observer.observe(lastMemoryRef.current)
    }

    return () => observer.disconnect()
  }, [loading]) //Corrected dependencies

  const toggleAudio = (id: number) => {
    if (playingAudio === id) {
      setPlayingAudio(null)
    } else {
      if (playingAudio !== null) {
        const prevAudio = document.getElementById(`audio-${playingAudio}`) as HTMLAudioElement
        prevAudio.pause()
      }
      setPlayingAudio(id)
      const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement
      audio.play()
    }
  }

  return (
    <div className="space-y-16">
      {visibleMemories.map((memory, index) => (
        <motion.div
          key={memory.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          ref={index === visibleMemories.length - 1 ? lastMemoryRef : null}
        >
          <div className="relative h-80 w-full">
            <Image src={memory.image || "/placeholder.svg"} alt={memory.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h2 className="text-3xl font-bold text-white mb-2">{memory.year}</h2>
              <h3 className="text-2xl font-semibold text-white mb-1">{memory.title}</h3>
              <p className="text-lg text-amber-100">{memory.description}</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-amber-800">Audio Memory</h4>
              <Button variant="outline" size="icon" onClick={() => toggleAudio(memory.id)}>
                {playingAudio === memory.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            <audio id={`audio-${memory.id}`} src={memory.audio} onEnded={() => setPlayingAudio(null)} />
          </div>
        </motion.div>
      ))}
      {loading && <p className="text-center text-amber-800">Loading more memories...</p>}
    </div>
  )
}

