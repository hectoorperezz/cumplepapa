"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import Timeline from "@/components/timeline"
import MusicPlayer from "@/components/music-player"
import VideoPlayer from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { LogOut, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function TimelinePage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">60 Años de Historias</h1>
          <div className="flex items-center gap-4">
            <Link href="/messages">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Mensajes</span>
              </Button>
            </Link>
            <MusicPlayer />
            <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Feliz 60 Cumpleaños, Papá</h2>
            <p className="text-lg text-muted-foreground">Un recorrido por los momentos más importantes de tu vida</p>
          </div>

          {/* Video destacado */}
          <div className="mb-12">
            <VideoPlayer
              src="/video/celebration.mp4"
              poster="/placeholder.svg?height=720&width=1280&text=Video+de+Celebración"
            />
            <p className="text-center text-muted-foreground mt-3">Un recorrido por tus 60 años de vida</p>
          </div>

          <Timeline />
        </div>
      </main>
    </div>
  )
}

