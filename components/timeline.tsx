"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { timelineEvents } from "@/lib/data"
import { decadeSongs } from "@/lib/decade-songs"
import { cn } from "@/lib/utils"
import DecadePlayer from "./decade-player"
import ImageLightbox from "./image-lightbox"

// Imports
import { Play, Pause, RotateCcw, Info, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"

// Función para agrupar eventos por décadas
const groupEventsByDecade = (events: typeof timelineEvents) => {
  const decades: Record<string, typeof timelineEvents> = {}

  events.forEach((event) => {
    // Calcular la década (1960s, 1970s, etc.)
    const decadeStart = Math.floor(event.year / 10) * 10
    const decadeKey = `${decadeStart}`

    if (!decades[decadeKey]) {
      decades[decadeKey] = []
    }

    decades[decadeKey].push(event)
  })

  // Ordenar las décadas
  return Object.entries(decades)
    .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
    .map(([decade, events]) => ({
      decade: Number.parseInt(decade),
      events: events.sort((a, b) => a.year - b.year),
    }))
}

// Función para obtener la canción de una década
const getSongForDecade = (decade: number) => {
  return decadeSongs.find((song) => song.decade === decade)
}

// Preparar las imágenes para el lightbox
const getAllTimelineImages = () => {
  return timelineEvents.map((event) => ({
    src: event.image || `/placeholder.svg?height=800&width=1200&text=${event.year}`,
    alt: `${event.year} - ${event.title}`,
  }))
}

// Función para obtener una animación específica para imágenes
const getImageAnimationClass = (decadeIndex: number, eventIndex: number) => {
  const imageAnimations = [
    "image-fade-in", // Aparición suave
    "image-slide-up", // Deslizamiento hacia arriba
    "image-zoom-in", // Zoom suave
    "image-rotate-in", // Rotación suave
    "image-slide-left", // Deslizamiento desde la izquierda
    "image-slide-right", // Deslizamiento desde la derecha
  ]

  // Seleccionar animación basada en la posición
  const animIndex = (decadeIndex * 2 + eventIndex * 3) % imageAnimations.length
  return imageAnimations[animIndex]
}

export default function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const groupedEvents = groupEventsByDecade(timelineEvents)
  const allImages = getAllTimelineImages()

  // Estado para el lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Estados para auto-scroll
  const [autoScrollActive, setAutoScrollActive] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(1)
  const autoScrollRef = useRef<number | null>(null)
  const lastInteractionRef = useRef<number>(Date.now())

  // Estado para controlar qué eventos tienen detalles expandidos
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({})

  // Función para abrir el lightbox con una imagen específica
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  // Función para alternar la expansión de detalles de un evento
  const toggleEventDetails = (eventId: string) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }))
  }

  // Funciones para auto-scroll
  const startAutoScroll = () => {
    if (autoScrollRef.current) return

    setAutoScrollActive(true)

    const scroll = () => {
      // Verificar si ha habido interacción reciente (últimos 2 segundos)
      if (Date.now() - lastInteractionRef.current < 2000) {
        return
      }

      window.scrollBy({
        top: scrollSpeed,
        behavior: "smooth",
      })

      autoScrollRef.current = requestAnimationFrame(scroll)
    }

    autoScrollRef.current = requestAnimationFrame(scroll)
  }

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current)
      autoScrollRef.current = null
    }
    setAutoScrollActive(false)
  }

  const toggleAutoScroll = () => {
    if (autoScrollActive) {
      stopAutoScroll()
    } else {
      startAutoScroll()
    }
  }

  const handleSpeedChange = (value: number[]) => {
    setScrollSpeed(value[0])
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Configuración de animaciones para los elementos del timeline
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
          entry.target.classList.remove("opacity-0")
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll(".timeline-item")
    elements.forEach((el) => observer.observe(el))

    // Observar también los encabezados de década para animarlos
    const decadeHeaders = document.querySelectorAll(".decade-header")
    decadeHeaders.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
      decadeHeaders.forEach((el) => observer.unobserve(el))
    }
  }, [])

  // Gestión de interacción del usuario para auto-scroll
  useEffect(() => {
    // Detectar interacción del usuario
    const handleUserInteraction = () => {
      lastInteractionRef.current = Date.now()

      // Si el usuario hace scroll manual, pausamos brevemente el auto-scroll
      if (autoScrollActive) {
        stopAutoScroll()
        // Reanudar después de 3 segundos si sigue activo
        setTimeout(() => {
          if (autoScrollActive) {
            startAutoScroll()
          }
        }, 3000)
      }
    }

    // Limpiar el auto-scroll cuando se desmonta el componente
    const cleanup = () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current)
      }
    }

    window.addEventListener("wheel", handleUserInteraction)
    window.addEventListener("touchmove", handleUserInteraction)
    window.addEventListener("keydown", handleUserInteraction)

    return () => {
      cleanup()
      window.removeEventListener("wheel", handleUserInteraction)
      window.removeEventListener("touchmove", handleUserInteraction)
      window.removeEventListener("keydown", handleUserInteraction)
    }
  }, [autoScrollActive])

  // Actualizar el auto-scroll cuando cambia la velocidad
  useEffect(() => {
    if (autoScrollActive) {
      stopAutoScroll()
      startAutoScroll()
    }
  }, [scrollSpeed])

  // Encontrar el índice global de un evento en el array de todos los eventos
  const findGlobalEventIndex = (decade: number, eventIndex: number): number => {
    let globalIndex = 0
    let foundIndex = -1

    for (const { decade: decadeValue, events } of groupedEvents) {
      if (decadeValue === decade) {
        foundIndex = globalIndex + eventIndex
        break
      }
      globalIndex += events.length
    }

    return foundIndex >= 0 ? foundIndex : 0
  }

  // Función para determinar el tipo de layout para un evento
  const getEventLayout = (decadeIndex: number, eventIndex: number) => {
    // Crear variedad de layouts basados en la posición del evento
    const layoutTypes = [
      "fullImage", // Imagen grande con texto mínimo
      "largeImage", // Imagen grande con texto a un lado
      "gallery", // Estilo galería con imagen dominante
      "minimal", // Imagen dominante con título y año
      "immersive", // Imagen a pantalla completa con mínimo texto
    ]

    // Usar una combinación de índices para seleccionar un layout de manera "pseudo-aleatoria" pero consistente
    const layoutIndex = (decadeIndex + eventIndex * 2) % layoutTypes.length
    return layoutTypes[layoutIndex]
  }

  // Función para obtener la clase de animación basada en la posición
  const getAnimationClass = (decadeIndex: number, eventIndex: number) => {
    const animations = [
      "fade-in-up", // Aparecer desde abajo
      "fade-in-down", // Aparecer desde arriba
      "fade-in-left", // Aparecer desde la izquierda
      "fade-in-right", // Aparecer desde la derecha
      "zoom-in", // Aparecer con zoom
      "rotate-in", // Aparecer con rotación
    ]

    // Seleccionar animación basada en la posición
    const animIndex = (decadeIndex * 3 + eventIndex) % animations.length
    return animations[animIndex]
  }

  return (
    <div ref={timelineRef} className="relative">
      {/* Timeline center line - más sutil */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/10"></div>

      {/* Lightbox para imágenes ampliadas */}
      <ImageLightbox
        images={allImages}
        initialIndex={currentImageIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />

      {/* Timeline events grouped by decades */}
      <div className="space-y-16 relative">
        {groupedEvents.map(({ decade, events }, decadeIndex) => {
          const decadeSong = getSongForDecade(decade)

          return (
            <div key={decade} className="mb-16">
              {/* Decade header - más compacto */}
              <div className="relative mb-8 decade-header opacity-0 transition-all duration-1000 ease-out">
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 z-10">
                  <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg">
                    {decade}s
                  </div>
                </div>
                <div className="pt-12 text-center">
                  <h2 className="text-2xl font-bold">Década de los {decade}</h2>
                </div>
              </div>

              {/* Decade song player - más compacto */}
              {decadeSong && (
                <div className="mb-8 max-w-md mx-auto">
                  <DecadePlayer song={decadeSong} />
                </div>
              )}

              {/* Events within the decade */}
              <div className="space-y-12">
                {events.map((event, eventIndex) => {
                  const globalEventIndex = findGlobalEventIndex(decade, eventIndex)
                  const placeholderUrl = `/placeholder.svg?height=800&width=1200&text=${event.year}`
                  const layout = getEventLayout(decadeIndex, eventIndex)
                  const animationClass = getAnimationClass(decadeIndex, eventIndex)
                  const eventId = `${decade}-${event.year}`
                  const isExpanded = expandedEvents[eventId] || false

                  // Renderizar diferentes layouts según el tipo seleccionado
                  if (layout === "fullImage") {
                    // Layout de imagen completa con texto mínimo
                    return (
                      <div
                        key={eventId}
                        className={cn("timeline-item opacity-0 transition-all duration-700 ease-out", animationClass)}
                        style={{ transitionDelay: `${eventIndex * 150}ms` }}
                      >
                        <div className="relative max-w-4xl mx-auto">
                          <Card className="overflow-hidden shadow-xl">
                            <div
                              className="relative h-[500px] w-full cursor-pointer"
                              onClick={() => openLightbox(globalEventIndex)}
                            >
                              <Image
                                src={event.image || placeholderUrl}
                                alt={`${event.year} - ${event.title}`}
                                fill
                                className={`object-cover ${getImageAnimationClass(decadeIndex, eventIndex)}`}
                                style={{ "--index": eventIndex } as React.CSSProperties}
                                priority={eventIndex === 0}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                  <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-md">
                                      {event.year}
                                    </div>
                                    <h3 className="text-2xl font-bold">{event.title}</h3>
                                  </div>

                                  {isExpanded && (
                                    <div className="mt-4 animate-fadeIn">
                                      <p className="text-white/80 mb-3">{event.description}</p>
                                      {event.anecdote && (
                                        <blockquote className="border-l-2 border-primary/50 pl-4 italic text-white/70">
                                          {event.anecdote}
                                        </blockquote>
                                      )}
                                    </div>
                                  )}

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-3 text-white hover:text-white hover:bg-white/20"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleEventDetails(eventId)
                                    }}
                                  >
                                    {isExpanded ? (
                                      <>
                                        <X className="h-4 w-4 mr-1" />
                                        Ocultar detalles
                                      </>
                                    ) : (
                                      <>
                                        <Info className="h-4 w-4 mr-1" />
                                        Ver detalles
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    )
                  } else if (layout === "largeImage") {
                    // Layout con imagen grande y texto a un lado
                    return (
                      <div
                        key={eventId}
                        className={cn("timeline-item opacity-0 transition-all duration-700 ease-out", animationClass)}
                        style={{ transitionDelay: `${eventIndex * 150}ms` }}
                      >
                        <div className="max-w-5xl mx-auto">
                          <Card className="overflow-hidden shadow-lg">
                            <div className="flex flex-col md:flex-row">
                              <div
                                className="md:w-2/3 relative cursor-pointer"
                                onClick={() => openLightbox(globalEventIndex)}
                              >
                                <div className="relative h-80 md:h-[400px]">
                                  <Image
                                    src={event.image || placeholderUrl}
                                    alt={`${event.year} - ${event.title}`}
                                    fill
                                    className={`object-cover ${getImageAnimationClass(decadeIndex, eventIndex)}`}
                                    style={{ "--index": eventIndex } as React.CSSProperties}
                                  />
                                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                    <span className="bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
                                      Ampliar imagen
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="md:w-1/3 p-6 relative">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md">
                                    {event.year}
                                  </div>
                                  <h3 className="text-xl font-bold">{event.title}</h3>
                                </div>

                                {isExpanded && (
                                  <div className="animate-fadeIn">
                                    <p className="text-muted-foreground mb-3">{event.description}</p>
                                    {event.anecdote && (
                                      <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground text-sm">
                                        {event.anecdote}
                                      </blockquote>
                                    )}
                                  </div>
                                )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-3"
                                  onClick={() => toggleEventDetails(eventId)}
                                >
                                  {isExpanded ? (
                                    <>
                                      <X className="h-4 w-4 mr-1" />
                                      Ocultar detalles
                                    </>
                                  ) : (
                                    <>
                                      <Info className="h-4 w-4 mr-1" />
                                      Ver detalles
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    )
                  } else if (layout === "gallery") {
                    // Layout estilo galería con imagen dominante
                    return (
                      <div
                        key={eventId}
                        className={cn("timeline-item opacity-0 transition-all duration-700 ease-out", animationClass)}
                        style={{ transitionDelay: `${eventIndex * 150}ms` }}
                      >
                        <div className="max-w-4xl mx-auto">
                          <div className="flex flex-col items-center">
                            <div className="mb-4">
                              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg">
                                {event.year}
                              </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-4 text-center">{event.title}</h3>

                            <Card
                              className="overflow-hidden shadow-xl w-full cursor-pointer transform transition-transform hover:scale-[1.01]"
                              onClick={() => openLightbox(globalEventIndex)}
                            >
                              <div className="relative h-[450px] w-full">
                                <Image
                                  src={event.image || placeholderUrl}
                                  alt={`${event.year} - ${event.title}`}
                                  fill
                                  className={`object-cover ${getImageAnimationClass(decadeIndex, eventIndex)} image-shine`}
                                  style={{ "--index": eventIndex } as React.CSSProperties}
                                />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                  <span className="bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
                                    Ampliar imagen
                                  </span>
                                </div>
                              </div>
                            </Card>

                            {isExpanded ? (
                              <div className="mt-4 max-w-2xl mx-auto text-center animate-fadeIn">
                                <p className="text-muted-foreground mb-3">{event.description}</p>
                                {event.anecdote && (
                                  <blockquote className="border-t-2 border-primary/30 pt-3 italic text-muted-foreground text-sm">
                                    "{event.anecdote}"
                                  </blockquote>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => toggleEventDetails(eventId)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Ocultar detalles
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => toggleEventDetails(eventId)}
                              >
                                <Info className="h-4 w-4 mr-1" />
                                Ver detalles
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  } else if (layout === "minimal") {
                    // Layout minimalista con imagen dominante
                    return (
                      <div
                        key={eventId}
                        className={cn("timeline-item opacity-0 transition-all duration-700 ease-out", animationClass)}
                        style={{ transitionDelay: `${eventIndex * 150}ms` }}
                      >
                        <div className="max-w-3xl mx-auto">
                          <Card className="overflow-hidden shadow-lg">
                            <div
                              className="relative h-[350px] w-full cursor-pointer"
                              onClick={() => openLightbox(globalEventIndex)}
                            >
                              <Image
                                src={event.image || placeholderUrl}
                                alt={`${event.year} - ${event.title}`}
                                fill
                                className={`object-cover ${getImageAnimationClass(decadeIndex, eventIndex)}`}
                                style={{ "--index": eventIndex } as React.CSSProperties}
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70">
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold">{event.title}</h3>
                                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md">
                                      {event.year}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isExpanded && (
                              <CardContent className="p-4 animate-fadeIn">
                                <p className="text-muted-foreground mb-3">{event.description}</p>
                                {event.anecdote && (
                                  <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground text-sm">
                                    {event.anecdote}
                                  </blockquote>
                                )}
                              </CardContent>
                            )}

                            <div className="px-4 pb-4 pt-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-center"
                                onClick={() => toggleEventDetails(eventId)}
                              >
                                {isExpanded ? (
                                  <>
                                    <X className="h-4 w-4 mr-1" />
                                    Ocultar detalles
                                  </>
                                ) : (
                                  <>
                                    <Info className="h-4 w-4 mr-1" />
                                    Ver detalles
                                  </>
                                )}
                              </Button>
                            </div>
                          </Card>
                        </div>
                      </div>
                    )
                  } else if (layout === "immersive") {
                    // Layout inmersivo con imagen a pantalla completa
                    return (
                      <div
                        key={eventId}
                        className={cn("timeline-item opacity-0 transition-all duration-700 ease-out", animationClass)}
                        style={{ transitionDelay: `${eventIndex * 150}ms` }}
                      >
                        <div
                          className="relative h-[70vh] max-h-[600px] w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl cursor-pointer"
                          onClick={() => openLightbox(globalEventIndex)}
                        >
                          <Image
                            src={event.image || placeholderUrl}
                            alt={`${event.year} - ${event.title}`}
                            fill
                            className={`object-cover ${getImageAnimationClass(decadeIndex, eventIndex)} image-shine`}
                            style={{ "--index": eventIndex } as React.CSSProperties}
                            priority={eventIndex === 0}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8">
                            <div className="flex items-center gap-4 mb-2">
                              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-lg">
                                {event.year}
                              </div>
                              <h3 className="text-3xl font-bold text-white">{event.title}</h3>
                            </div>

                            {isExpanded && (
                              <div className="mt-4 max-w-2xl animate-fadeIn">
                                <p className="text-white/90 mb-3">{event.description}</p>
                                {event.anecdote && (
                                  <blockquote className="border-l-2 border-primary/50 pl-4 italic text-white/80">
                                    {event.anecdote}
                                  </blockquote>
                                )}
                              </div>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-3 text-white hover:text-white hover:bg-white/20 w-auto self-start"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleEventDetails(eventId)
                              }}
                            >
                              {isExpanded ? (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  Ocultar detalles
                                </>
                              ) : (
                                <>
                                  <Info className="h-4 w-4 mr-1" />
                                  Ver detalles
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    // Layout por defecto (no debería llegar aquí)
                    return (
                      <div
                        key={eventId}
                        className={cn("timeline-item opacity-0 transition-all duration-700 ease-out", animationClass)}
                        style={{ transitionDelay: `${eventIndex * 150}ms` }}
                      >
                        <Card className="overflow-hidden shadow-lg max-w-4xl mx-auto">
                          <div
                            className="relative h-80 w-full cursor-pointer"
                            onClick={() => openLightbox(globalEventIndex)}
                          >
                            <Image
                              src={event.image || placeholderUrl}
                              alt={`${event.year} - ${event.title}`}
                              fill
                              className={`object-cover ${getImageAnimationClass(decadeIndex, eventIndex)}`}
                              style={{ "--index": eventIndex } as React.CSSProperties}
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md">
                                  {event.year}
                                </div>
                                <h3 className="text-xl font-bold">{event.title}</h3>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Auto-scroll controls */}
      <div className="fixed bottom-6 right-6 z-50">
        <TooltipProvider>
          <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-3 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={toggleAutoScroll}>
                    {autoScrollActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {autoScrollActive ? "Pausar desplazamiento" : "Iniciar desplazamiento automático"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={scrollToTop}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Volver al inicio</TooltipContent>
              </Tooltip>
            </div>

            {autoScrollActive && (
              <div className="w-full space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Lento</span>
                  <span>Rápido</span>
                </div>
                <Slider
                  value={[scrollSpeed]}
                  min={0.5}
                  max={5}
                  step={0.5}
                  onValueChange={handleSpeedChange}
                  className="w-24"
                />
              </div>
            )}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}

