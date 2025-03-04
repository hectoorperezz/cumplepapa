"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock } from "lucide-react"

export default function LoginForm() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const correctPassword = "birthday2024"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === correctPassword) {
      localStorage.setItem("isAuthenticated", "true")
      router.push("/album")
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="password"
            placeholder="Enter the special password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
          />
          <Lock className="absolute right-3 top-2.5 h-5 w-5 text-amber-500" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
        Enter Dad's Birthday Album
      </Button>
    </form>
  )
}

