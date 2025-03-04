"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  color: string
  velocity: {
    x: number
    y: number
  }
  alpha: number
  life: number
  size: number
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animationFrameId = useRef<number>(0)

  const colors = [
    "#FF5252", // Red
    "#FFD740", // Amber
    "#64FFDA", // Teal
    "#448AFF", // Blue
    "#B388FF", // Purple
    "#FF80AB", // Pink
    "#FF9E80", // Deep Orange
    "#CCFF90", // Light Green
  ]

  const createFirework = (canvas: HTMLCanvasElement) => {
    const x = Math.random() * canvas.width
    const y = canvas.height * 0.8 - Math.random() * canvas.height * 0.4
    const particleCount = 60 + Math.floor(Math.random() * 40)
    const color = colors[Math.floor(Math.random() * colors.length)]

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 5 + 2

      particles.current.push({
        x,
        y,
        color,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        },
        alpha: 1,
        life: Math.random() * 50 + 50,
        size: Math.random() * 3 + 1,
      })
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with semi-transparent black for trail effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    particles.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.velocity.x
      particle.y += particle.velocity.y

      // Add gravity
      particle.velocity.y += 0.05

      // Reduce life and alpha
      particle.life -= 1
      particle.alpha = particle.life / 100

      // Draw particle
      ctx.globalAlpha = particle.alpha
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()

      // Remove dead particles
      if (particle.life <= 0) {
        particles.current.splice(index, 1)
      }
    })

    // Reset global alpha
    ctx.globalAlpha = 1

    // Randomly create new fireworks
    if (Math.random() < 0.05) {
      createFirework(canvas)
    }

    animationFrameId.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Start animation
    animationFrameId.current = requestAnimationFrame(animate)

    // Initial fireworks
    for (let i = 0; i < 3; i++) {
      createFirework(canvas)
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, []) // Removed dependencies here

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
}

