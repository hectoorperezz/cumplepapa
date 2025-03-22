// Información de canciones por década
export interface DecadeSong {
  decade: number
  title: string
  artist: string
  file: string
}

// Canciones representativas de cada década
export const decadeSongs: DecadeSong[] = [
  {
    decade: 1960,
    title: "Stand By Me",
    artist: "Ben E. King",
    file: "/music/decades/1960s.mp3",
  },
  {
    decade: 1970,
    title: "Imagine",
    artist: "John Lennon",
    file: "/music/decades/1970s.mp3",
  },
  {
    decade: 1980,
    title: "Billie Jean",
    artist: "Michael Jackson",
    file: "/music/decades/1980s.mp3",
  },
  {
    decade: 1990,
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    file: "/music/decades/1990s.mp3",
  },
  {
    decade: 2000,
    title: "Clocks",
    artist: "Coldplay",
    file: "/music/decades/2000s.mp3",
  },
  {
    decade: 2010,
    title: "Rolling in the Deep",
    artist: "Adele",
    file: "/music/decades/2010s.mp3",
  },
  {
    decade: 2020,
    title: "Blinding Lights",
    artist: "The Weeknd",
    file: "/music/decades/2020s.mp3",
  },
]

