import { create } from "zustand"
import { persist } from "zustand/middleware"

interface MusicState {
  isPlaying: boolean
  volume: number
  togglePlay: () => void
  setVolume: (volume: number) => void
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      isPlaying: false,
      volume: 0.5,
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setVolume: (volume: number) => set({ volume }),
    }),
    {
      name: "music-storage",
    },
  ),
)

