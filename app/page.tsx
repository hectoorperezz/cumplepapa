import Image from "next/image"
import LoginForm from "@/components/login-form"
import Fireworks from "@/components/fireworks"
import BirthdayDecorations from "@/components/birthday-decorations"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Fireworks />
      <BirthdayDecorations />
      <div className="max-w-4xl w-full relative z-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-amber-900 mb-4">Happy Birthday, Dad!</h1>
            <p className="text-lg text-amber-700 mb-6">
              A journey through cherished memories and heartfelt wishes, created just for you.
            </p>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-amber-800 mb-2">A Message for You</h2>
              <p className="text-amber-600 italic">
                "Dad, your love, wisdom, and strength have shaped our lives in countless ways. This album is a small
                token of our immense gratitude and love for you. Happy Birthday to the world's best dad!"
              </p>
            </div>
            <LoginForm />
          </div>
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <Image
              src="/dad-photo.jpg"
              alt="Happy memories with Dad"
              layout="fill"
              objectFit="cover"
              className="rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

