"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, Heart, Cake } from "lucide-react"
import { useMessagesStore } from "@/lib/messages-store"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function MensajeInvitadoPage() {
  const { messages, addMessage } = useMessagesStore()
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (name.trim() && message.trim()) {
      // Simular un pequeño retraso para dar sensación de procesamiento
      setTimeout(() => {
        addMessage({
          id: Date.now().toString(),
          name,
          relation: relation || "Amigo/a",
          message,
          date: new Date().toISOString(),
        })

        toast({
          title: "¡Mensaje enviado!",
          description: "Tu mensaje ha sido guardado correctamente.",
        })

        // Resetear el formulario
        setName("")
        setRelation("")
        setMessage("")
        setIsSubmitting(false)
      }, 800)
    } else {
      setIsSubmitting(false)
      toast({
        title: "Error al enviar",
        description: "Por favor completa al menos tu nombre y mensaje.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
              <Cake className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">¡Celebramos 60 años!</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Deja un mensaje especial para celebrar este día tan importante
            </p>
          </div>

          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Deja tu mensaje de felicitación
              </CardTitle>
              <CardDescription>
                Comparte tus recuerdos, anécdotas o buenos deseos para este día especial
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Tu nombre
                    </label>
                    <Input
                      id="name"
                      placeholder="Escribe tu nombre"
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
                      placeholder="Ej: Amigo, Familiar, Compañero..."
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Tu mensaje
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Escribe tu mensaje de felicitación..."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="resize-none"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Enviar mensaje
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">Gracias por ser parte de esta celebración especial</p>
            <div className="flex justify-center mt-2">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

