'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserIcon, UsersIcon } from 'lucide-react'

// Types
type Player = {
  id: string
  name: string
  role: string
}

type Team = Player[]

type GameFormat = '5v5' | '6v6' | '11v11'

// Helper functions
const generateTeams = (players: Player[], format: GameFormat): [Team, Team] => {
  const shuffled = [...players].sort(() => 0.5 - Math.random())
  const teamSize = parseInt(format.split('v')[0])
  return [shuffled.slice(0, teamSize), shuffled.slice(teamSize, teamSize * 2)]
}

const generateRole = (index: number, format: GameFormat): string => {
  const roles = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper']
  const teamSize = parseInt(format.split('v')[0])
  const roleIndex = Math.floor((index / teamSize) * roles.length)
  return roles[roleIndex]
}

export function FootballBookingComponent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [gameFormat, setGameFormat] = useState<GameFormat>('5v5')
  const [timeSlot, setTimeSlot] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<[Team, Team] | null>(null)

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      role: generateRole(players.length, gameFormat)
    }
    setPlayers([...players, newPlayer])
    setName('')
    setEmail('')

    const teamSize = parseInt(gameFormat.split('v')[0])
    if (players.length + 1 === teamSize * 2) {
      setTeams(generateTeams([...players, newPlayer], gameFormat))
    }
  }

  const regenerateTeams = () => {
    if (players.length > 0) {
      setTeams(generateTeams(players, gameFormat))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Football Booking and Team Generator</h1>
      
      {/* Booking Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Book a Spot</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBooking} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Game Format</Label>
              <RadioGroup defaultValue={gameFormat} onValueChange={(value) => setGameFormat(value as GameFormat)} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5v5" id="5v5" />
                  <Label htmlFor="5v5">5v5</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6v6" id="6v6" />
                  <Label htmlFor="6v6">6v6</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="11v11" id="11v11" />
                  <Label htmlFor="11v11">11v11</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeSlot">Time Slot</Label>
              <Select onValueChange={setTimeSlot} required>
                <SelectTrigger id="timeSlot">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="19:00">19:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Book Spot</Button>
          </form>
        </CardContent>
      </Card>

      {/* Team Display */}
      {teams && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Generated Teams</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teams.map((team, teamIndex) => (
              <Card key={teamIndex} className={`${teamIndex === 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
                <CardHeader>
                  <CardTitle className={`text-center ${teamIndex === 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    Team {teamIndex + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {team.map((player) => (
                      <div key={player.id} className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center text-center">
                        <UserIcon className="w-8 h-8 mb-2" />
                        <h3 className="font-semibold">{player.name}</h3>
                        <p className="text-sm text-gray-600">{player.role}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center">
            <Button onClick={regenerateTeams}>Regenerate Teams</Button>
          </div>
        </div>
      )}

      {/* Available Spots */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Available Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-2">
            <UsersIcon className="w-6 h-6" />
            <span className="text-lg font-semibold">
              {players.length} / {parseInt(gameFormat.split('v')[0]) * 2} players
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}