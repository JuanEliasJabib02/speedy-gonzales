export type Project = {
  id: string
  name: string
  description: string
  repoUrl: string
  activeFeatures: number
  totalFeatures: number
  ticketCount: number
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: "speedy-gonzales",
    name: "Speedy Gonzales",
    description: "AI dev team command center for managing features and tickets",
    repoUrl: "github.com/JuanEliasJabib02/speedy-gonzales",
    activeFeatures: 5,
    totalFeatures: 8,
    ticketCount: 32,
  },
]
