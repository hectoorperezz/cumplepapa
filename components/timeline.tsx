"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { useState } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

// Updated sample data with audio (keep the existing data)
const timelineData = [
  {
    id: 1,
    year: "1970",
    title: "Childhood",
    description: "The early years in hometown",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/path-to-audio-file-1.mp3", // Replace with actual audio file path
    messages: [
      {
        id: 1,
        name: "Uncle Bob",
        avatar: "/placeholder.svg?height=40&width=40",
        message: "I remember when we used to play in the backyard. You were always the adventurous one!",
      },
    ],
  },
  {
    id: 2,
    year: "1985",
    title: "College Years",
    description: "Studying and making lifelong friends",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/path-to-audio-file-2.mp3", // Replace with actual audio file path
    messages: [
      {
        id: 1,
        name: "Mike",
        avatar: "/placeholder.svg?height=40&width=40",
        message: "We had the best times in college! Remember that road trip we took senior year?",
      },
      {
        id: 2,
        name: "Sarah",
        avatar: "/placeholder.svg?height=40&width=40",
        message: "You were always the one helping everyone with their homework. Such a kind heart!",
      },
    ],
  },
  {
    id: 3,
    year: "1990",
    title: "Wedding Day",
    description: "The beginning of a beautiful family",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/path-to-audio-file-3.mp3", // Replace with actual audio file path
    messages: [
      {
        id: 1,
        name: "Mom",
        avatar: "/placeholder.svg?height=40&width=40",
        message: "The happiest day of our lives. You looked so handsome and nervous!",
      },
    ],
  },
  {
    id: 4,
    year: "1995",
    title: "Becoming a Father",
    description: "The joy of parenthood",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/path-to-audio-file-4.mp3", // Replace with actual audio file path
    messages: [
      {
        id: 1,
        name: "Aunt Jane",
        avatar: "/placeholder.svg?height=40&width=40",
        message: "You were born to be a father. I've never seen someone so natural with children.",
      },
    ],
  },
  {
    id: 5,
    year: "2010",
    title: "Career Achievement",
    description: "Recognition for years of hard work",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/path-to-audio-file-5.mp3", // Replace with actual audio file path
    messages: [
      {
        id: 1,
        name: "Colleague David",
        avatar: "/placeholder.svg?height=40&width=40",
        message: "Your dedication and integrity in your work has always been an inspiration to all of us.",
      },
    ],
  },
  {
    id: 6,
    year: "Present",
    title: "Happy Birthday!",
    description: "Celebrating another year of your amazing life",
    image: "/placeholder.svg?height=400&width=600",
    audio: "/path-to-audio-file-6.mp3", // Replace with actual audio file path
    messages: [
      {
        id: 1,
        name: "Your Children",
        avatar: "/placeholder.svg?height=40&width=40",
        message: "Dad, you've always been our hero and our guide. We love you more than words can express!",
      },
      {
        id: 2,
        name: "Friends & Family",
        avatar: "/placeholder.svg?height=40&width=40",
        message: "Happy Birthday to an amazing father, husband, friend, and human being!",
      },
    ],
  },
]

export default function Timeline() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const toggleAudio = (id: number) => {
    if (playingAudio === id) {
      setPlayingAudio(null)
    } else {
      if (playingAudio !== null) {
        const prevAudio = document.getElementById(`audio-${playingAudio}`) as HTMLAudioElement
        prevAudio.pause()
      }
      setPlayingAudio(id)
      const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement
      audio.play()
    }
  }

  return (
    <div className="space-y-16">
      {timelineData.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <div className="absolute left-1/2 -ml-0.5 w-1 h-full bg-amber-300" />
          <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center`}>
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} layout="fill" objectFit="cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h2 className="text-3xl font-bold text-white mb-2">{item.year}</h2>
                    <h3 className="text-2xl font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-lg text-amber-100">{item.description}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-semibold text-amber-800">Audio Memory</h4>
                    <Button variant="outline" size="icon" onClick={() => toggleAudio(item.id)}>
                      {playingAudio === item.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                  <audio id={`audio-${item.id}`} src={item.audio} onEnded={() => setPlayingAudio(null)} />
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <Card
                className="overflow-hidden border-amber-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => toggleExpand(item.id)}
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-amber-800 mb-4">Messages from loved ones:</h3>
                    <div className="space-y-4">
                      {item.messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={expandedId === item.id ? { opacity: 0, y: 20 } : false}
                          animate={expandedId === item.id ? { opacity: 1, y: 0 } : false}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex gap-3">
                            <Avatar>
                              <AvatarImage src={message.avatar} alt={message.name} />
                              <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-amber-900">{message.name}</p>
                              <p className="text-gray-600">{message.message}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

