"use client"

import type React from "react"
import { motion } from "framer-motion"

interface BalloonProps {
  color: string
  size: number
  delay: number
}

const Balloon: React.FC<BalloonProps> = ({ color, size, delay }) => {
  return (
    <motion.div
      initial={{ y: "100vh", opacity: 0 }}
      animate={{ y: "-100vh", opacity: 1 }}
      transition={{
        duration: Math.random() * 10 + 10,
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "linear",
      }}
      style={{
        position: "absolute",
        left: `${Math.random() * 100}%`,
        width: size,
        height: size * 1.2,
      }}
    >
      <svg viewBox="0 0 50 60" width={size} height={size * 1.2}>
        <path
          d="M25 0C11.2 0 0 11.2 0 25C0 38.8 11.2 50 25 50C38.8 50 50 38.8 50 25C50 11.2 38.8 0 25 0Z"
          fill={color}
        />
        <path d="M25 50L20 60H30L25 50Z" fill={color} />
      </svg>
      <div
        style={{
          width: "1px",
          height: "100px",
          backgroundColor: "#888",
          position: "absolute",
          bottom: "-100px",
          left: "50%",
        }}
      />
    </motion.div>
  )
}

export default Balloon

