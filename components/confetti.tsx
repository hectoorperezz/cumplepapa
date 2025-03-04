"use client"

import { useEffect, useState } from "react"
import JSConfetti from "js-confetti"

interface ConfettiProps {
  trigger?: boolean
}

export default function Confetti({ trigger = true }: ConfettiProps) {
  const [confetti, setConfetti] = useState<JSConfetti | null>(null)

  useEffect(() => {
    // Initialize confetti
    const jsConfetti = new JSConfetti()
    setConfetti(jsConfetti)

    // Fire confetti when component mounts if trigger is true
    if (trigger) {
      setTimeout(() => {
        jsConfetti.addConfetti({
          confettiColors: ["#FF5252", "#FFD740", "#64FFDA", "#448AFF", "#B388FF", "#FF80AB", "#FF9E80", "#CCFF90"],
          confettiRadius: 6,
          confettiNumber: 200,
        })
      }, 500)

      // Add another burst after a delay
      setTimeout(() => {
        jsConfetti.addConfetti({
          emojis: ["🎂", "🎁", "🎉", "🎊", "🥳", "❤️", "✨"],
          emojiSize: 30,
          confettiNumber: 30,
        })
      }, 1500)
    }

    return () => {
      // No cleanup needed for JSConfetti
    }
  }, [trigger])

  return null // This component doesn't render anything visible
}

