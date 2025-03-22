import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Message {
  id: string
  name: string
  relation?: string
  message: string
  date: string
}

interface MessagesState {
  messages: Message[]
  addMessage: (message: Message) => void
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message: Message) =>
        set((state) => ({
          messages: [message, ...state.messages],
        })),
    }),
    {
      name: "messages-storage",
    },
  ),
)

