"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string
  size: number
  lifetime: number
  age: number
}

interface Firework {
  x: number
  y: number
  targetY: number
  speed: number
  particles: Particle[]
  color: string
  exploded: boolean
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fireworksRef = useRef<Firework[]>([])
  const animationFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const lastFireworkRef = useRef<number>(0)

  // Colors for the fireworks
  const colors = [
    "#FF5252", // Red
    "#FF4081", // Pink
    "#E040FB", // Purple
    "#7C4DFF", // Deep Purple
    "#536DFE", // Indigo
    "#448AFF", // Blue
    "#40C4FF", // Light Blue
    "#18FFFF", // Cyan
    "#64FFDA", // Teal
    "#69F0AE", // Green
    "#B2FF59", // Light Green
    "#EEFF41", // Lime
    "#FFFF00", // Yellow
    "#FFD740", // Amber
    "#FFAB40", // Orange
    "#FF6E40", // Deep Orange
  ]

  const createFirework = (x: number, y: number, targetY: number): Firework => {
    return {
      x,
      y,
      targetY,
      speed: 2 + Math.random() * 3,
      particles: [],
      color: colors[Math.floor(Math.random() * colors.length)],
      exploded: false,
    }
  }

  const createParticles = (x: number, y: number, color: string): Particle[] => {
    const particles: Particle[] = []
    const particleCount = 60 + Math.floor(Math.random() * 40)

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 3
      const size = 1 + Math.random() * 2

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size,
        lifetime: 40 + Math.random() * 40,
        age: 0,
      })
    }

    return particles
  }

  const updateAndDrawFireworks = (ctx: CanvasRenderingContext2D, deltaTime: number) => {
    const { width, height } = ctx.canvas

    // Update and draw fireworks
    fireworksRef.current.forEach((firework, index) => {
      if (!firework.exploded) {
        // Move the firework up
        firework.y -= firework.speed * deltaTime * 0.05

        // Draw the firework trail
        ctx.beginPath()
        ctx.arc(firework.x, firework.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = firework.color
        ctx.fill()

        // Check if the firework reached its target height
        if (firework.y <= firework.targetY) {
          // Explode
          firework.exploded = true
          firework.particles = createParticles(firework.x, firework.y, firework.color)
        }
      } else {
        // Update and draw particles
        firework.particles.forEach((particle, particleIndex) => {
          // Apply gravity
          particle.vy += 0.05 * deltaTime * 0.05

          // Move the particle
          particle.x += particle.vx * deltaTime * 0.05
          particle.y += particle.vy * deltaTime * 0.05

          // Age the particle
          particle.age += deltaTime * 0.05
          particle.alpha = 1 - particle.age / particle.lifetime

          // Draw the particle
          if (particle.alpha > 0) {
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255)
              .toString(16)
              .padStart(2, "0")}`
            ctx.fill()
          }
        })

        // Remove dead particles
        firework.particles = firework.particles.filter((particle) => particle.alpha > 0)

        // Remove firework if all particles are dead
        if (firework.particles.length === 0) {
          fireworksRef.current.splice(index, 1)
        }
      }
    })

    // Randomly create new fireworks
    const now = performance.now()
    if (now - lastFireworkRef.current > 800 + Math.random() * 1000) {
      const x = Math.random() * width
      const targetY = height * 0.2 + Math.random() * (height * 0.3)
      fireworksRef.current.push(createFirework(x, height, targetY))
      lastFireworkRef.current = now
    }
  }

  const animate = (time: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Calculate delta time
    const deltaTime = time - (lastTimeRef.current || time)
    lastTimeRef.current = time

    // Clear canvas with semi-transparent black for trail effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Update and draw fireworks
    updateAndDrawFireworks(ctx, deltaTime)

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />
}

