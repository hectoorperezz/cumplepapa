"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { useMusicStore } from "@/lib/music-store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function MusicPlayer() {
  const { isPlaying, togglePlay, volume, setVolume } = useMusicStore()
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevVolume = useRef(volume)

  useEffect(() => {
    audioRef.current = new Audio("/music/background-music.mp3")
    audioRef.current.loop = true

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

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
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={togglePlay} className="h-8 w-8">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isPlaying ? "Pausar música" : "Reproducir música"}</TooltipContent>
        </Tooltip>

        <div className="hidden sm:flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isMuted ? "Activar sonido" : "Silenciar"}</TooltipContent>
          </Tooltip>

          <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-20" />
        </div>
      </div>
    </TooltipProvider>
  )
}

