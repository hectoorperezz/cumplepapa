"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Cake, Gift } from "lucide-react"
import Fireworks from "@/components/fireworks"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showFireworks, setShowFireworks] = useState(false)
  const router = useRouter()
  const { isAuthenticated, login } = useAuthStore()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/timeline")
    }
  }, [isAuthenticated, router])

  // Show fireworks after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "feliz-cumple") {
      login()
      router.push("/timeline")
    } else {
      setError("Contraseña incorrecta. Por favor, inténtalo de nuevo.")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Fireworks animation */}
      {showFireworks && <Fireworks />}

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8 animate-in" style={{ animationDelay: "200ms" }}>
          <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
            <Cake className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">¡Feliz 60 Cumpleaños!</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto text-white">
            Un recorrido especial por los momentos más importantes de tu vida
          </p>
        </div>

        <div
          className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 animate-in"
          style={{ animationDelay: "400ms" }}
        >
          {/* Cover image card */}
          <Card className="w-full lg:w-1/2 overflow-hidden shadow-lg">
            <div className="relative h-64 sm:h-80 lg:h-full">
              <Image src="/cover-image.jpg" alt="Celebración de cumpleaños" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <h2 className="text-2xl font-bold text-white mb-2">60 Años de Historias</h2>
                <p className="text-white/80">Un viaje a través del tiempo con los momentos que han marcado tu vida</p>
              </div>
            </div>
          </Card>

          {/* Login card */}
          <Card className="w-full lg:w-1/2 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Regalo Especial</CardTitle>
              <CardDescription>Introduce la contraseña para acceder a tu regalo de cumpleaños</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Introduce la contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  <Gift className="mr-2 h-4 w-4" />
                  Abrir mi regalo
                </Button>
                <p className="text-sm text-muted-foreground text-center">Con todo nuestro cariño, tu familia</p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

