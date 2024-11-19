'use client'

import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/firebase/clientApp'
import { collection, addDoc } from 'firebase/firestore'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SparklesCore } from "@/components/ui/sparkles"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Toaster, toast } from "sonner"
import Link from 'next/link'

export default function CreateTeam() {
  const [user] = useAuthState(auth)
  const [teamData, setTeamData] = useState({
    teamName: '',
    location: '',
    kitColor: '',
    league: false,
    manager: '',
    players: [],
    upcommingMatches: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const newTeam = {
        ...teamData,
        manager: user.uid,
        players: [user.uid], // Add creator as first player
        winRate: 0
      }

      await addDoc(collection(db, 'teams'), newTeam)
      toast.success('Team created successfully!')
    } catch (error) {
      console.error('Error creating team:', error)
      toast.error('Failed to create team')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-theme-dark flex items-center justify-center">
        <Card className="w-full max-w-md bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-theme-background mb-4">Please Login</h2>
            <Link href="/login">
              <Button className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light">
                Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme-dark relative overflow-hidden">
      <Navbar user={user} auth={auth} />

      <div className="fixed inset-0 w-full h-full">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#00DF81"
        />
      </div>

      <div className="relative z-10 container mx-auto flex justify-center items-center px-4 py-24 min-h-screen">
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
              <input
                type="text"
                placeholder="Location"
                value={teamData.location}
                onChange={(e) => setTeamData({ ...teamData, location: e.target.value })}
                className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
              />
              <input
                type="text"
                placeholder="Kit Color"
                value={teamData.kitColor}
                onChange={(e) => setTeamData({ ...teamData, kitColor: e.target.value })}
                className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={teamData.league}
                  onChange={(e) => setTeamData({ ...teamData, league: e.target.checked })}
                  className="border border-theme-accent"
                />
                <label className="text-theme-background">League Team</label>
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
      </div>

      <Footer />
      <Toaster richColors />
    </div>
  )
}
