"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Timeline from "@/components/timeline"
import Confetti from "@/components/confetti"
import { Button } from "@/components/ui/button"
import { LogOut, Share2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function AlbumPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [shareLink, setShareLink] = useState("")

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    if (!isAuthenticated) {
      router.push("/")
    } else {
      setLoading(false)
      setShowConfetti(true)
      const token = Math.random().toString(36).substring(2, 15)
      setShareLink(`${window.location.origin}/shared/${token}`)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
    alert("Share link copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <p className="text-amber-800 text-xl">Loading memories...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      {showConfetti && <Confetti />}
      <header className="p-4 flex justify-between items-center border-b border-amber-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-amber-900">Dad's Life Journey</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-amber-400 text-amber-700">
                <Share2 className="mr-2 h-4 w-4" /> Share Album
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share album</DialogTitle>
                <DialogDescription>
                  Anyone with this link will be able to view the album without a password.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <Input value={shareLink} readOnly className="flex-1" />
                <Button type="submit" onClick={copyShareLink}>
                  Copy
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="border-amber-400 text-amber-700" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <Timeline />
      </main>
      <footer className="text-center p-6 text-amber-700 border-t border-amber-200 bg-white/80 backdrop-blur-sm">
        <p>Happy Birthday Dad! With love from all of us.</p>
      </footer>
    </div>
  )
}

