'use client'

import { useState, Suspense } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/firebase/clientApp'
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Toaster, toast } from "sonner"
import Link from 'next/link'
import Spline from '@splinetool/react-spline'

export default function CreateProfile() {
  const [user] = useAuthState(auth)
  const [playerData, setPlayerData] = useState({
    fullName: '',
    jerseyNumber: '',
    preferredPosition: '',
    preferredFoot: '',
    fitnessLevel: '',
    injuryStatus: 'Healthy'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      // First create the stats document
      const statsRef = await addDoc(collection(db, 'stats'), {
        player_id: user.uid,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0
      })

      // Then create the player profile with reference to stats
      await addDoc(collection(db, 'playerInfo'), {
        ...playerData,
        userId: user.uid,
        stats_id: statsRef.id
      })

      toast.success('Player profile created successfully!')
      // Optional: Redirect to player info page
      window.location.href = '/player-info'
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-theme-dark flex flex-col">
        <div className="flex-grow flex items-center justify-center">
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
        <Footer 
        logo="KickHub"
        description="Revolutionizing the way football enthusiasts connect, play, and compete."
        quickLinks={['Book a Game', 'Player Stats', 'Merchandise', 'About Us']}
        gameFormats={['5v5 Format', '6v6 Format', '11v11 Format', 'Custom Games']}
      />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme-dark relative overflow-hidden flex flex-col">
      <Navbar user={user} auth={auth} />

      <div className="fixed inset-0 w-full h-full">
        <Suspense fallback={null}>
          <Spline 
            scene="https://prod.spline.design/kEz1OD81GbhmtueE/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
      </div>

      <div className="relative z-10 container mx-auto flex justify-center items-center px-4 py-24 flex-grow">
        <Card className="w-full max-w-2xl min-h-screen bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
          <CardHeader>
            <CardTitle className="text-theme-background">Create Player Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={playerData.fullName}
                onChange={(e) => setPlayerData({ ...playerData, fullName: e.target.value })}
                className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
                required
              />
              
              <input
                type="text"
                placeholder="Jersey Number"
                value={playerData.jerseyNumber}
                onChange={(e) => setPlayerData({ ...playerData, jerseyNumber: e.target.value })}
                className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
                required
              />

              <select
                value={playerData.preferredPosition}
                onChange={(e) => setPlayerData({ ...playerData, preferredPosition: e.target.value })}
                className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
                required
              >
                <option value="">Select Preferred Position</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
              </select>

              <select
                value={playerData.preferredFoot}
                onChange={(e) => setPlayerData({ ...playerData, preferredFoot: e.target.value })}
                className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
                required
              >
                <option value="">Select Preferred Foot</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
                <option value="Both">Both</option>
              </select>

              <select
                value={playerData.fitnessLevel}
                onChange={(e) => setPlayerData({ ...playerData, fitnessLevel: e.target.value })}
                className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
                required
              >
                <option value="">Select Fitness Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Professional">Professional</option>
              </select>

              <select
                value={playerData.injuryStatus}
                onChange={(e) => setPlayerData({ ...playerData, injuryStatus: e.target.value })}
                className="w-full p-2 bg-theme-dark/30 border border-theme-accent text-theme-background rounded-none rounded-tl-lg rounded-tr-lg"
                required
              >
                <option value="Healthy">Healthy</option>
                <option value="Injured">Injured</option>
                <option value="Recovering">Recovering</option>
              </select>

              <Button 
                type="submit"
                className="w-full bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
              >
                Create Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer 
        logo="KickHub"
        description="Revolutionizing the way football enthusiasts connect, play, and compete."
        quickLinks={['Book a Game', 'Player Stats', 'Merchandise', 'About Us']}
        gameFormats={['5v5 Format', '6v6 Format', '11v11 Format', 'Custom Games']}
      />
      <Toaster richColors />
    </div>
  )
}
