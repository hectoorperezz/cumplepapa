"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react"
import type { DecadeSong } from "@/lib/decade-songs"
import { useMusicStore } from "@/lib/music-store"

interface DecadePlayerProps {
  song: DecadeSong
}

export default function DecadePlayer({ song }: DecadePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevVolume = useRef(volume)
  const { isPlaying: isGlobalPlaying, togglePlay: toggleGlobalPlay } = useMusicStore()

  useEffect(() => {
    audioRef.current = new Audio(song.file)
    audioRef.current.volume = volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [song.file])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Pause global music if decade music starts playing
        if (isGlobalPlaying) {
          toggleGlobalPlay()
        }

        audioRef.current.play().catch((error) => {
          console.error("Error playing decade audio:", error)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, isGlobalPlaying, toggleGlobalPlay])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (value[0] > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
      setVolume(prevVolume.current)
    } else {
      prevVolume.current = volume
      setIsMuted(true)
      setVolume(0)
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium flex items-center gap-2">
          <Music className="h-4 w-4" />
          {song.title}
        </h4>
        <p className="text-sm text-muted-foreground">{song.artist}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={togglePlay} className="h-8 w-8">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-20" />
        </div>
      </div>
    </div>
  )
}

