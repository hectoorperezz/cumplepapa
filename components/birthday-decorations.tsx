"use client"

import { useEffect, useState } from "react"

export default function BirthdayDecorations() {
  const [balloons, setBalloons] = useState<{ id: number; x: number; delay: number; size: number }[]>([])

  useEffect(() => {
    // Create random balloons
    const newBalloons = []
    for (let i = 0; i < 10; i++) {
      newBalloons.push({
        id: i,
        x: Math.random() * 100, // Random position across the screen (percentage)
        delay: Math.random() * 5, // Random animation delay
        size: Math.random() * 30 + 40, // Random size between 40-70px
      })
    }
    setBalloons(newBalloons)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating balloons */}
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="absolute bottom-0 animate-float"
          style={{
            left: `${balloon.x}%`,
            animationDelay: `${balloon.delay}s`,
            animationDuration: `${10 + balloon.delay * 2}s`,
          }}
        >
          <div className="relative" style={{ width: balloon.size, height: balloon.size * 1.2 }}>
            <svg
              viewBox="0 0 50 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "100%" }}
            >
              <path
                d="M25 0C11.2 0 0 11.2 0 25C0 38.8 11.2 50 25 50C38.8 50 50 38.8 50 25C50 11.2 38.8 0 25 0Z"
                fill={`hsl(${balloon.id * 36}, 100%, 65%)`}
              />
              <path d="M25 50L20 60H30L25 50Z" fill={`hsl(${balloon.id * 36}, 80%, 45%)`} />
              <line x1="25" y1="60" x2="25" y2="80" stroke={`hsl(${balloon.id * 36}, 80%, 45%)`} strokeWidth="1" />
            </svg>
          </div>
        </div>
      ))}

      {/* Birthday cake at the bottom */}
      <div className="absolute bottom-4 left-4 opacity-70">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="50" width="60" height="40" fill="#FFB6C1" rx="5" />
            <rect x="15" y="40" width="70" height="15" fill="#FF69B4" rx="5" />
            <rect x="25" y="30" width="50" height="15" fill="#FFB6C1" rx="5" />
            <circle cx="50" cy="25" r="5" fill="#FFC0CB" />
            <rect x="49" y="15" width="2" height="10" fill="#A0522D" />
            <circle cx="50" cy="15" r="3" fill="#FF6347" />
          </svg>
        </div>
      </div>

      {/* Gift box at the bottom right */}
      <div className="absolute bottom-4 right-4 opacity-70">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="40" width="60" height="50" fill="#6A5ACD" rx="2" />
            <rect x="20" y="30" width="60" height="15" fill="#9370DB" rx="2" />
            <rect x="45" y="30" width="10" height="60" fill="#FFD700" />
            <rect x="20" y="45" width="60" height="10" fill="#FFD700" />
            <path d="M50 15 C40 25, 60 25, 50 30" fill="#FF69B4" stroke="#FF69B4" strokeWidth="2" />
            <path d="M50 15 C60 25, 40 25, 50 30" fill="#FF69B4" stroke="#FF69B4" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  )
}

