'use client'

import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/firebase/clientApp'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface TeamFormData {
  teamName: string
  location: string
  kitColor: string
  league: boolean
  manager: string
  players: string[]
  upcommingMatches: any[]
}

interface TeamCreationFormProps {
  onSuccess?: () => void
}

export function TeamCreationForm({ onSuccess }: TeamCreationFormProps) {
  const [user] = useAuthState(auth)
  const [showOtherLocation, setShowOtherLocation] = useState(false)
  const [teamData, setTeamData] = useState<TeamFormData>({
    teamName: '',
    location: '',
    kitColor: '',
    league: false,
    manager: '',
    players: [],
    upcommingMatches: []
  })

  const locations = [
    "Discovery Park (Wanderers)",
    "Discovery Park (Sandton)",
    "Huddle Park",
    "Edenvale",
    "Bruma",
    "Other"
  ]

  const handleLocationChange = (value: string) => {
    setShowOtherLocation(value === "Other")
    setTeamData({ ...teamData, location: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const playerInfoQuery = query(
        collection(db, 'playerInfo'),
        where('userId', '==', user.uid)
      )
      const playerInfoSnapshot = await getDocs(playerInfoQuery)

      if (playerInfoSnapshot.empty) {
        toast.error('Please create a player profile first')
        return
      }

      const playerDoc = playerInfoSnapshot.docs[0]
      const playerId = playerDoc.id

      const newTeam = {
        ...teamData,
        manager: user.uid,
        players: [playerId],
        winRate: 0
      }

      await addDoc(collection(db, 'teams'), newTeam)
      toast.success('Team created successfully!')
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error creating team:', error)
      toast.error('Failed to create team')
    }
  }

  return (
    <Card className="max-w-2xl mx-auto bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
      <CardHeader>
        <CardTitle className="text-theme-background">Create New Team</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Team Name"
            value={teamData.teamName}
            onChange={(e) => setTeamData({ ...teamData, teamName: e.target.value })}
            className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
          />
          <select
            value={teamData.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          {showOtherLocation && (
            <input
              type="text"
              placeholder="Enter custom location"
              value={teamData.location === "Other" ? "" : teamData.location}
              onChange={(e) => setTeamData({ ...teamData, location: e.target.value })}
              className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
            />
          )}
          <input
            type="text"
            placeholder="Kit Color"
            value={teamData.kitColor}
            onChange={(e) => setTeamData({ ...teamData, kitColor: e.target.value })}
            className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
          />
          <div className="flex items-center space-x-2">
            <Switch
              checked={teamData.league}
              onCheckedChange={(checked) => setTeamData({ ...teamData, league: checked })}
            />
            <Label htmlFor="league-mode" className="text-theme-background">League Team</Label>
          </div>
          <Button 
            type="submit"
            className="w-full bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
          >
            Create Team
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 