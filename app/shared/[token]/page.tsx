"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Timeline from "@/components/timeline"
import Confetti from "@/components/confetti"

export default function SharedAlbumPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)

  useEffect(() => {
    // In a real app, you'd verify the token with your backend
    // For this demo, we'll just check if it's not empty
    if (params.token && params.token !== "") {
      setIsValidToken(true)
    }
    setLoading(false)
  }, [params.token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <p className="text-amber-800 text-xl">Loading shared album...</p>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <p className="text-amber-800 text-xl">Invalid or expired share link.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <Confetti />
      <header className="p-4 flex justify-center items-center border-b border-amber-200">
        <h1 className="text-2xl font-bold text-amber-900">Dad's Life Journey (Shared Album)</h1>
      </header>
      <main className="container mx-auto py-8 px-4">
        <Timeline />
      </main>
      <footer className="text-center p-6 text-amber-700 border-t border-amber-200">
        <p>Happy Birthday Dad! With love from all of us.</p>
      </footer>
    </div>
  )
}

