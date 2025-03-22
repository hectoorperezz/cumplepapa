"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MessageSquare, Send, Heart, Copy, Check, Share2 } from "lucide-react"
import Link from "next/link"
import { useMessagesStore } from "@/lib/messages-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function MessagesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { messages, addMessage } = useMessagesStore()
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")
  const [message, setMessage] = useState("")
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && message.trim()) {
      addMessage({
        id: Date.now().toString(),
        name,
        relation: relation || "Familiar",
        message,
        date: new Date().toISOString(),
      })
      setName("")
      setRelation("")
      setMessage("")

      toast({
        title: "Mensaje añadido",
        description: "El mensaje ha sido añadido correctamente.",
      })
    }
  }

  const copyShareLink = () => {
    // Obtener la URL base del sitio
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/mensaje`

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      toast({
        title: "¡Enlace copiado!",
        description: "El enlace para compartir ha sido copiado al portapapeles.",
      })

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }

  const shareLink = () => {
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/mensaje`
    const shareText = "Deja un mensaje para celebrar el 60 cumpleaños"

    if (navigator.share) {
      navigator
        .share({
          title: "Celebración 60 Cumpleaños",
          text: shareText,
          url: shareUrl,
        })
        .catch((error) => console.log("Error compartiendo", error))
    } else {
      copyShareLink()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getRandomColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-pink-500",
      "bg-purple-500",
      "bg-indigo-500",
      "bg-blue-500",
      "bg-cyan-500",
      "bg-teal-500",
      "bg-green-500",
      "bg-lime-500",
      "bg-yellow-500",
      "bg-amber-500",
      "bg-orange-500",
    ]

    // Usar el nombre para generar un índice consistente
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/timeline">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al Timeline</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Mensajes de Felicitación</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Mensajes de cariño de familiares y amigos para celebrar este día especial
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="outline" className="flex items-center gap-2" onClick={copyShareLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "¡Copiado!" : "Copiar enlace para invitados"}
              </Button>

              <Button className="flex items-center gap-2" onClick={shareLink}>
                <Share2 className="h-4 w-4" />
                Compartir enlace
              </Button>
            </div>
          </div>

          <Tabs defaultValue="messages" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="messages">Ver mensajes ({messages.length})</TabsTrigger>
              <TabsTrigger value="add">Añadir mensaje</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="mt-6">
              {messages.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                    <div>
                      <h3 className="text-lg font-medium">No hay mensajes aún</h3>
                      <p className="text-muted-foreground mt-1">
                        Comparte el enlace con familiares y amigos para que dejen sus felicitaciones
                      </p>
                    </div>
                    <Button variant="outline" className="mt-2" onClick={shareLink}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Compartir enlace
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {messages.map((msg) => (
                    <Card key={msg.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-6 flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className={`${getRandomColor(msg.name)}`}>
                              <AvatarFallback>{getInitials(msg.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{msg.name}</h3>
                              <p className="text-sm text-muted-foreground">{msg.relation || "Amigo/a"}</p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <p className="text-xs text-muted-foreground">
                              {new Date(msg.date).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <Heart className="h-4 w-4 text-red-400" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="add" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Añadir nuevo mensaje
                  </CardTitle>
                  <CardDescription>Añade un mensaje directamente desde aquí</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Nombre
                        </label>
                        <Input
                          id="name"
                          placeholder="Nombre del remitente"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="relation" className="text-sm font-medium">
                          Relación (opcional)
                        </label>
                        <Input
                          id="relation"
                          placeholder="Ej: Familiar, Amigo..."
                          value={relation}
                          onChange={(e) => setRelation(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Mensaje
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Escribe el mensaje..."
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Guardar mensaje
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Toaster />
    </div>
  )
}

