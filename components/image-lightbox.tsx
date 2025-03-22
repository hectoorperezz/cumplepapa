"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageLightboxProps {
  images: {
    src: string
    alt: string
  }[]
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ImageLightbox({ images, initialIndex, open, onOpenChange }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Reset current index when the lightbox opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
    }
  }, [open, initialIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape") {
        onOpenChange(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  if (!open) return null

  const currentImage = images[currentIndex]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-lg w-[90vw] h-[90vh] p-0 bg-background/95 backdrop-blur-sm">
        <div className="relative flex flex-col h-full">
          {/* Top controls */}
          <div className="flex justify-between items-center p-2 absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm">
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} / {images.length}
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </Button>
            </DialogClose>
          </div>

          {/* Image container */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={currentImage.src || "/placeholder.svg"}
                alt={currentImage.alt}
                width={1200}
                height={800}
                className="max-h-full max-w-full object-contain"
                priority
              />
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-background/40 backdrop-blur-sm ml-2"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Anterior</span>
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-background/40 backdrop-blur-sm mr-2"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Siguiente</span>
            </Button>
          </div>

          {/* Caption */}
          <div className="p-4 text-center bg-background/80 backdrop-blur-sm">
            <p className="font-medium">{currentImage.alt}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

