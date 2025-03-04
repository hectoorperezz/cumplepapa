"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import Balloon from "./balloon"

// Sample data (replace with actual data or API calls)
const initialMessages = [
  { id: 1, author: "Alice", message: "Happy birthday, Dad! Love you!", timestamp: new Date().toISOString() },
  {
    id: 2,
    author: "Bob",
    message: "Wishing you all the best on your special day!",
    timestamp: new Date().toISOString(),
  },
]

const birthdayDate = new Date("2024-06-15") // Replace with actual birthday

const getRandomPosition = () => ({
  x: Math.random() * (window.innerWidth - 200),
  y: Math.random() * (window.innerHeight - 200),
})

const getRandomColor = () => {
  const colors = ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#FFDFBA"]
  return colors[Math.floor(Math.random() * colors.length)]
}

interface Message {
  id: number
  author: string
  message: string
  timestamp: string
  position?: { x: number; y: number }
  color?: string
}

export default function LiveMessageWall() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState({ author: "", message: "" })
  const [isBirthday, setIsBirthday] = useState(false)

  useEffect(() => {
    // Check if today is the birthday
    const today = new Date()
    setIsBirthday(today.getDate() === birthdayDate.getDate() && today.getMonth() === birthdayDate.getMonth())

    // Position initial messages
    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({
        ...msg,
        position: getRandomPosition(),
        color: getRandomColor(),
      })),
    )

    // Simulate receiving new messages (replace with actual real-time implementation)
    const interval = setInterval(() => {
      if (isBirthday) {
        const randomMessage = {
          id: Math.random(),
          author: `Friend ${Math.floor(Math.random() * 100)}`,
          message: `Happy birthday! Here's to another great year!`,
          timestamp: new Date().toISOString(),
          position: getRandomPosition(),
          color: getRandomColor(),
        }
        setMessages((prevMessages) => [...prevMessages, randomMessage])
      }
    }, 10000) // Add a new message every 10 seconds

    return () => clearInterval(interval)
  }, [isBirthday])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.author && newMessage.message && isBirthday) {
      const message = {
        id: Math.random(),
        ...newMessage,
        timestamp: new Date().toISOString(),
        position: getRandomPosition(),
        color: getRandomColor(),
      }
      setMessages((prevMessages) => [...prevMessages, message])
      setNewMessage({ author: "", message: "" })
    }
  }

  const removeMessage = (id: number) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id))
  }

  const balloons = Array.from({ length: 10 }, (_, i) => ({
    color: getRandomColor(),
    size: Math.random() * 30 + 30,
    delay: i * 2,
  }))

  return (
    <div className="h-[calc(100vh-200px)] relative overflow-hidden">
      {balloons.map((balloon, index) => (
        <Balloon key={index} {...balloon} />
      ))}
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          style={{
            position: "absolute",
            left: message.position?.x,
            top: message.position?.y,
            backgroundColor: message.color,
          }}
          className="w-48 p-4 rounded-lg shadow-lg"
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1"
            onClick={() => removeMessage(message.id)}
          >
            <X className="h-4 w-4" />
          </Button>
          <p className="font-semibold">{message.author}</p>
          <p className="text-sm mt-2">{message.message}</p>
          <p className="text-xs mt-2 opacity-60">{new Date(message.timestamp).toLocaleString()}</p>
        </motion.div>
      ))}
      {isBirthday ? (
        <form onSubmit={handleSubmit} className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <Input
            placeholder="Your Name"
            value={newMessage.author}
            onChange={(e) => setNewMessage({ ...newMessage, author: e.target.value })}
            className="mb-2"
          />
          <Textarea
            placeholder="Your Message"
            value={newMessage.message}
            onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
            className="mb-2"
          />
          <Button type="submit">Send Birthday Wish</Button>
        </form>
      ) : (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg text-center">
          <p>Birthday messages will be enabled on {birthdayDate.toDateString()}.</p>
        </div>
      )}
    </div>
  )
}

