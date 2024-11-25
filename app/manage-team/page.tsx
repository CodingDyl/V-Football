'use client'

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/firebase/clientApp'
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SparklesCore } from "@/components/ui/sparkles"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpdateMatchModal } from '@/components/UpdateMatchModal'
import { CreateTeamSheetModal } from '@/components/CreateTeamSheetModal'
import { CreateMatchModal } from '@/components/CreateMatchModal'
import Link from 'next/link'

interface TeamPlayer {
  id: string;
  fullName: string;
  jerseyNumber: string;
  preferredPosition: string;
  stats?: PlayerStats;
}

interface PlayerStats {
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  opponent: string;
  location: string;
  status: 'upcoming' | 'completed';
  format: '5v5' | '6v6' | '11v11';
  substitutesEnabled: boolean;
  requiredPlayers: number;
  score?: {
    home: number;
    away: number;
  };
}

interface TeamSheet {
  id: string;
  matchId: string;
  players: string[];
  formation: string;
  created: string;
}

interface MatchFormData {
  date: string;
  opponent: string;
  location: string;
  status: 'upcoming' | 'completed';
}

// Add new interface for team
interface Team {
  id: string;
  teamName: string;
  location: string;
  league: boolean;
  winRate: number;
  manager: string;
  players: string[];
}

export default function ManageTeam() {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string>('')
  const [team, setTeam] = useState<any>(null)
  const [players, setPlayers] = useState<TeamPlayer[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [teamSheets, setTeamSheets] = useState<TeamSheet[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isUpdateMatchModalOpen, setIsUpdateMatchModalOpen] = useState(false)
  const [isTeamSheetModalOpen, setIsTeamSheetModalOpen] = useState(false)
  const [isCreateMatchModalOpen, setIsCreateMatchModalOpen] = useState(false)

  useEffect(() => {
    const fetchTeams = async () => {
      if (!user) return

      try {
        const teamsRef = collection(db, 'teams')
        const teamQuery = query(teamsRef, where('manager', '==', user.uid))
        const teamSnapshot = await getDocs(teamQuery)

        if (teamSnapshot.empty) {
          setLoading(false)
          return
        }

        const teamsData = teamSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Team[]
        
        setTeams(teamsData)
        setSelectedTeamId(teamsData[0].id) // Select first team by default
      } catch (error) {
        console.error('Error fetching teams:', error)
      }
    }

    fetchTeams()
  }, [user])

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!selectedTeamId) return

      setLoading(true)
      try {
        const selectedTeam = teams.find(t => t.id === selectedTeamId)
        setTeam(selectedTeam)

        // Fetch players
        const playersPromises = selectedTeam?.players.map(async (playerId: string) => {
          const playerDoc = await getDoc(doc(db, 'playerInfo', playerId))
          if (!playerDoc.exists()) return null
          return { id: playerId, ...playerDoc.data() }
        }) || []
        const playersData = (await Promise.all(playersPromises)).filter(player => player !== null) as TeamPlayer[]
        setPlayers(playersData)

        // Fetch matches
        const matchesRef = collection(db, 'matches')
        const matchesQuery = query(matchesRef, where('teamId', '==', selectedTeamId))
        const matchesSnapshot = await getDocs(matchesQuery)
        const matchesData = matchesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Match[]
        setMatches(matchesData)

        // Fetch team sheets
        const sheetsRef = collection(db, 'teamSheets')
        const sheetsQuery = query(sheetsRef, where('teamId', '==', selectedTeamId))
        const sheetsSnapshot = await getDocs(sheetsQuery)
        const sheetsData = sheetsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TeamSheet[]
        setTeamSheets(sheetsData)

      } catch (error) {
        console.error('Error fetching team data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [selectedTeamId, teams])

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
        <p className="text-theme-background mt-4 animate-pulse">Loading team data...</p>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-theme-dark flex items-center justify-center">
        <Card className="w-full max-w-md bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-theme-background mb-4">No Team Found</h2>
            <p className="text-theme-light mb-4">You need to be part of a team to access this page.</p>
            <Link href="/join-team">
              <Button className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light">
                Join a Team
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

      <div className="min-h-screen relative z-10 container mx-auto px-4 py-24">
        {teams.length > 1 && (
          <div className="mb-8">
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full max-w-xs p-2 bg-theme-dark/50 backdrop-blur-sm border border-theme-accent rounded text-theme-background"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>
        )}

        <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent mb-8">
          <CardHeader>
            <CardTitle className="text-theme-background">{team.teamName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-theme-light">
              <div>Location: {team.location}</div>
              <div>League Status: {team.league ? 'League Team' : 'Non-League Team'}</div>
              <div>Win Rate: {(team.winRate * 100).toFixed(1)}%</div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="players" className="space-y-4">
          <TabsList className="bg-theme-dark/50 border border-theme-accent">
            <TabsTrigger value="players" className="text-theme-background">Players</TabsTrigger>
            <TabsTrigger value="matches" className="text-theme-background">Matches</TabsTrigger>
            <TabsTrigger value="teamsheets" className="text-theme-background">Team Sheets</TabsTrigger>
          </TabsList>

          <TabsContent value="players">
            <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
              <CardHeader>
                <CardTitle className="text-theme-background">Team Players</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-theme-background">Name</TableHead>
                      <TableHead className="text-theme-background">Number</TableHead>
                      <TableHead className="text-theme-background">Position</TableHead>
                      <TableHead className="text-theme-background">Goals</TableHead>
                      <TableHead className="text-theme-background">Assists</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="text-theme-light">{player.fullName}</TableCell>
                        <TableCell className="text-theme-light">{player.jerseyNumber}</TableCell>
                        <TableCell className="text-theme-light">{player.preferredPosition}</TableCell>
                        <TableCell className="text-theme-light">{player.stats?.goals || 0}</TableCell>
                        <TableCell className="text-theme-light">{player.stats?.assists || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-theme-background">Matches</CardTitle>
                <Button 
                  onClick={() => setIsCreateMatchModalOpen(true)}
                  className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
                >
                  Create Match
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-theme-background mb-4">Upcoming Matches</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-theme-background">Date</TableHead>
                          <TableHead className="text-theme-background">Opponent</TableHead>
                          <TableHead className="text-theme-background">Location</TableHead>
                          <TableHead className="text-theme-background">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {matches
                          .filter(match => match.status === 'upcoming')
                          .map((match) => (
                            <TableRow key={match.id}>
                              <TableCell className="text-theme-light">{match.date}</TableCell>
                              <TableCell className="text-theme-light">{match.opponent}</TableCell>
                              <TableCell className="text-theme-light">{match.location}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      setSelectedMatch(match)
                                      setIsTeamSheetModalOpen(true)
                                    }}
                                    className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
                                  >
                                    Create Team Sheet
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setSelectedMatch(match)
                                      setIsUpdateMatchModalOpen(true)
                                    }}
                                    className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={async () => {
                                      if (window.confirm('Are you sure you want to delete this match?')) {
                                        try {
                                          await deleteDoc(doc(db, 'matches', match.id));
                                          setMatches(matches.filter(m => m.id !== match.id));
                                          toast.success('Match deleted successfully');
                                        } catch (error) {
                                          console.error('Error deleting match:', error);
                                          toast.error('Failed to delete match');
                                        }
                                      }
                                    }}
                                    variant="destructive"
                                    className="bg-red-600 text-white hover:bg-red-700 border border-theme-light"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-theme-background mb-4">Previous Matches</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-theme-background">Date</TableHead>
                          <TableHead className="text-theme-background">Opponent</TableHead>
                          <TableHead className="text-theme-background">Score</TableHead>
                          <TableHead className="text-theme-background">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {matches
                          .filter(match => match.status === 'completed')
                          .map((match) => (
                            <TableRow key={match.id}>
                              <TableCell className="text-theme-light">{match.date}</TableCell>
                              <TableCell className="text-theme-light">{match.opponent}</TableCell>
                              <TableCell className="text-theme-light">
                                {match.score ? `${match.score.home} - ${match.score.away}` : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => {
                                    setSelectedMatch(match)
                                    setIsUpdateMatchModalOpen(true)
                                  }}
                                  className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
                                >
                                  Update Match
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teamsheets">
            <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
              <CardHeader>
                <CardTitle className="text-theme-background">Team Sheets</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-theme-background">Match</TableHead>
                      <TableHead className="text-theme-background">Date Created</TableHead>
                      <TableHead className="text-theme-background">Formation</TableHead>
                      <TableHead className="text-theme-background">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamSheets.map((sheet) => (
                      <TableRow key={sheet.id}>
                        <TableCell className="text-theme-light">
                          {matches.find(m => m.id === sheet.matchId)?.opponent || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-theme-light">{sheet.created}</TableCell>
                        <TableCell className="text-theme-light">{sheet.formation}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {/* Handle view team sheet */}}
                            className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <Toaster richColors />

      <CreateMatchModal
        isOpen={isCreateMatchModalOpen}
        onClose={() => setIsCreateMatchModalOpen(false)}
        teamId={team.id}
        teamLocation={team.location}
        onCreate={async (matchData) => {
          try {
            const matchesRef = collection(db, 'matches');
            const newMatch = {
              ...matchData,
              teamId: team.id,
            };
            await addDoc(matchesRef, newMatch);
            
            // Refresh matches
            const matchesQuery = query(matchesRef, where('teamId', '==', team.id));
            const matchesSnapshot = await getDocs(matchesQuery);
            const matchesData = matchesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Match[];
            setMatches(matchesData);
            
            setIsCreateMatchModalOpen(false);
            toast.success('Match created successfully');
          } catch (error) {
            console.error('Error creating match:', error);
            toast.error('Failed to create match');
          }
        }}
      />

      {selectedMatch && (
        <>
          <UpdateMatchModal
            isOpen={isUpdateMatchModalOpen}
            onClose={() => {
              setIsUpdateMatchModalOpen(false)
              setSelectedMatch(null)
            }}
            match={selectedMatch}
            players={players}
            onUpdate={async (updatedMatch) => {
              // Handle match update
              // You'll need to implement this
            }}
          />

          <CreateTeamSheetModal
            isOpen={isTeamSheetModalOpen}
            onClose={() => {
              setIsTeamSheetModalOpen(false)
              setSelectedMatch(null)
            }}
            match={selectedMatch}
            players={players}
            onCreate={async (teamSheet) => {
              // Handle team sheet creation
              // You'll need to implement this
            }}
          />
        </>
      )}
    </div>
  )
}
