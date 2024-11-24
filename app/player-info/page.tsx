'use client'

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/firebase/clientApp'
import { collection, doc, getDoc, query, where, getDocs, updateDoc, arrayRemove } from 'firebase/firestore'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { SparklesCore } from "@/components/ui/sparkles"
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EditPlayerForm } from '@/components/EditPlayerForm'
import { Toaster } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { JoinTeamModal } from '@/components/JoinTeamModal'

interface PlayerStats {
  assists: number
  cleanSheets: number
  goals: number
  ownGoals: number
  redCards: number
  yellowCards: number
}

interface PlayerInfo {
  id: string;
  fitnessLevel: string
  fullName: string
  injuryStatus: string
  jerseyNumber: string
  preferredFoot: string
  preferredPosition: string
  stats?: PlayerStats
}

interface TeamInfo {
  kitColor: string;
  league: boolean;
  location: string;
  teamName: string;
  winRate: number;
}

export default function PlayerInfoPage() {
  const [user] = useAuthState(auth)
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLeaveTeamModalOpen, setIsLeaveTeamModalOpen] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState<string>("")
  const [userTeams, setUserTeams] = useState<Array<{ id: string, teamName: string }>>([])
  const [isJoinTeamModalOpen, setIsJoinTeamModalOpen] = useState(false)

  const fetchPlayerInfo = async () => {
    if (!user) return

    try {
      // Query playerInfo collection where userId matches current user
      const playerInfoQuery = query(
        collection(db, 'playerInfo'),
        where('userId', '==', user.uid)
      )

      const playerInfoSnapshot = await getDocs(playerInfoQuery)

      if (!playerInfoSnapshot.empty) {
        const playerData = playerInfoSnapshot.docs[0].data()
        const playerId = playerInfoSnapshot.docs[0].id  // Get the player document ID
        
        // Fetch associated stats - create proper doc reference
        const statsDocRef = doc(db, 'stats', playerData.stats_id)
        const statsDoc = await getDoc(statsDocRef)
        const statsData = statsDoc.exists() ? statsDoc.data() : null

        // Updated: Use playerId instead of user.uid
        const teamsQuery = query(
          collection(db, 'teams'),
          where('players', 'array-contains', playerId)  // Changed from user.uid to playerId
        )
        const teamSnapshot = await getDocs(teamsQuery)
        
        if (!teamSnapshot.empty) {
          const teamData = teamSnapshot.docs[0].data() as TeamInfo
          setTeamInfo(teamData)
        }

        setPlayerInfo({
          ...playerData,
          id: playerInfoSnapshot.docs[0].id,
          stats: statsData
        } as PlayerInfo)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserTeams = async () => {
    if (!playerInfo) return
    
    try {
      const teamsQuery = query(
        collection(db, 'teams'),
        where('players', 'array-contains', playerInfo.id)
      )
      const teamsSnapshot = await getDocs(teamsQuery)
      const teams = teamsSnapshot.docs.map(doc => ({
        id: doc.id,
        teamName: doc.data().teamName
      }))
      setUserTeams(teams)
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const handleLeaveTeam = async () => {
    if (!selectedTeamId || !playerInfo) return
    
    try {
      const teamRef = doc(db, 'teams', selectedTeamId)
      await updateDoc(teamRef, {
        players: arrayRemove(playerInfo.id)
      })
      
      setIsLeaveTeamModalOpen(false)
      fetchPlayerInfo() // Refresh player info
      toast.success('Successfully left the team')
    } catch (error) {
      console.error('Error leaving team:', error)
      toast.error('Failed to leave team')
    }
  }

  useEffect(() => {
    fetchPlayerInfo()
  }, [user])

  useEffect(() => {
    if (isLeaveTeamModalOpen) {
      fetchUserTeams()
    }
  }, [isLeaveTeamModalOpen])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-dark flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-theme-accent rounded-full animate-spin border-t-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-theme-accent rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-theme-background mt-4 animate-pulse">Loading Player Profile...</p>
      </div>
    )
  }

  return (
    <>
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

      <div className="min-h-screen w-full relative">
        <div className="min-h-screenrelative z-10 container mx-auto px-4 py-24">
          {playerInfo ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Player Details Card */}
              <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
                <CardHeader>
                  <CardTitle className="text-theme-background">Player Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-theme-light">Full Name:</div>
                    <div className="text-theme-background">{playerInfo.fullName}</div>
                    <div className="text-theme-light">Jersey Number:</div>
                    <div className="text-theme-background">{playerInfo.jerseyNumber}</div>
                    <div className="text-theme-light">Position:</div>
                    <div className="text-theme-background">{playerInfo.preferredPosition}</div>
                    <div className="text-theme-light">Preferred Foot:</div>
                    <div className="text-theme-background">{playerInfo.preferredFoot}</div>
                    <div className="text-theme-light">Fitness Level:</div>
                    <div className="text-theme-background">{playerInfo.fitnessLevel}</div>
                    <div className="text-theme-light">Injury Status:</div>
                    <div className="text-theme-background">{playerInfo.injuryStatus}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
                <CardHeader>
                  <CardTitle className="text-theme-background">Player Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-theme-light">Goals:</div>
                    <div className="text-theme-background">{playerInfo.stats?.goals || 0}</div>
                    <div className="text-theme-light">Assists:</div>
                    <div className="text-theme-background">{playerInfo.stats?.assists || 0}</div>
                    <div className="text-theme-light">Clean Sheets:</div>
                    <div className="text-theme-background">{playerInfo.stats?.cleanSheets || 0}</div>
                    <div className="text-theme-light">Yellow Cards:</div>
                    <div className="text-theme-background">{playerInfo.stats?.yellowCards || 0}</div>
                    <div className="text-theme-light">Red Cards:</div>
                    <div className="text-theme-background">{playerInfo.stats?.redCards || 0}</div>
                    <div className="text-theme-light">Own Goals:</div>
                    <div className="text-theme-background">{playerInfo.stats?.ownGoals || 0}</div>
                  </div>
                </CardContent>
              </Card>

              {teamInfo ? (
                <>
                  <Card className="col-span-2 mt-8 bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
                    <CardHeader>
                      <CardTitle className="text-theme-background">Team Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-theme-light">Team Name:</div>
                        <div className="text-theme-background">{teamInfo.teamName}</div>
                        <div className="text-theme-light">Location:</div>
                        <div className="text-theme-background">{teamInfo.location}</div>
                        <div className="text-theme-light">Kit Color:</div>
                        <div className="text-theme-background">{teamInfo.kitColor}</div>
                        <div className="text-theme-light">League Status:</div>
                        <div className="text-theme-background">{teamInfo.league ? 'League Team' : 'Non-League Team'}</div>
                        <div className="text-theme-light">Win Rate:</div>
                        <div className="text-theme-background">{teamInfo.winRate}%</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-2 bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
                    <CardContent className="p-6 flex flex-col items-start justify-center gap-4">
                      <CardTitle className="text-theme-background mb-8">Manage Player Profile:</CardTitle>
                      <div className="flex flex-row items-center justify-around w-full px-4">
                        <Button 
                          onClick={() => setIsEditModalOpen(true)} 
                          className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
                        >
                          Edit Player Profile
                        </Button>
                        
                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                          <DialogContent className="bg-theme-dark border border-theme-accent">
                            <DialogHeader>
                              <DialogTitle className="text-theme-background">Edit Player Profile</DialogTitle>
                            </DialogHeader>
                            <EditPlayerForm 
                              playerInfo={playerInfo} 
                              onSuccess={() => {
                                setIsEditModalOpen(false)
                                // Refresh player info after update
                                fetchPlayerInfo()
                              }} 
                            />
                          </DialogContent>
                        </Dialog>
                        
                        <Link href="/create-team">
                          <Button className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light">
                            Create New Team
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => setIsJoinTeamModalOpen(true)}
                          className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
                        >
                          Join Team
                        </Button>
                        <Button 
                          onClick={() => setIsLeaveTeamModalOpen(true)}
                          className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
                        >
                          Leave Team
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="col-span-2 w-full mx-auto bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
                    <CardContent className="p-6 text-center">
                        <h2 className="text-2xl font-bold text-theme-background mb-4">No Team Profile Found</h2>
                        <div className="flex flex-row items-center justify-center gap-4 w-full px-4">
                        <Link href="/create-team">
                            <Button className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light">
                                Create A Team
                            </Button>
                        </Link>
                        <Button 
                          onClick={() => setIsJoinTeamModalOpen(true)}
                          className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
                        >
                          Join Team
                        </Button>
                        </div>
                    </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className=" min-h-[60vh] flex-grow flex items-center justify-center">
            <Card className="max-w-md mx-auto bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold text-theme-background mb-4">No Player Profile Found</h2>
                <Link href="/create-profile">
                  <Button className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light">
                    Create Player Profile
                  </Button>
                </Link>
              </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Footer />
        <Toaster richColors />
      </div>
      </div>

      <Dialog open={isLeaveTeamModalOpen} onOpenChange={setIsLeaveTeamModalOpen}>
      <DialogContent className="bg-theme-dark border border-theme-accent">
        <DialogHeader>
          <DialogTitle className="text-theme-background">Leave Team</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select onValueChange={setSelectedTeamId}>
            <SelectTrigger className="w-full text-white">
              <SelectValue placeholder="Select team to leave" />
            </SelectTrigger>
            <SelectContent className="text-white bg-theme-dark">
              {userTeams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.teamName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setIsLeaveTeamModalOpen(false)}
              variant="outline"
              className="border-theme-accent bg-theme-accent text-white hover:bg-theme-dark hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLeaveTeam}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!selectedTeamId}
            >
              Leave Team
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <JoinTeamModal 
      isOpen={isJoinTeamModalOpen} 
      onClose={() => setIsJoinTeamModalOpen(false)}
      playerId={playerInfo?.id}
    />
    </>
  )
}
