'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, limit, getDoc, doc, where } from 'firebase/firestore'
import { db, auth } from '@/firebase/clientApp'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SparklesCore } from "@/components/ui/sparkles"
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlayerModal } from '@/components/ui/player-modal'

interface PlayerStats {
  assists: number
  cleanSheets: number
  goals: number
  ownGoals: number
  redCards: number
  yellowCards: number
  player_id: string
}

interface PlayerInfo {
  fullName: string
  jerseyNumber: number
  preferredPosition: string
  teamName: string
  stats?: PlayerStats
}

interface CombinedPlayerData {
  stats: PlayerStats
  info: PlayerInfo
}

interface TeamData {
  kitColor: string
  league: boolean
  location: string
  teamName: string
  winRate: number
}

export default function StatsPage() {
  const [user] = useAuthState(auth)
  const [topScorers, setTopScorers] = useState<CombinedPlayerData[]>([])
  const [topAssists, setTopAssists] = useState<CombinedPlayerData[]>([])
  const [topCleanSheets, setTopCleanSheets] = useState<CombinedPlayerData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState<CombinedPlayerData | null>(null)
  const [teamData, setTeamData] = useState<TeamData | null>(null)
  const [allTeamData, setAllTeamData] = useState<TeamData[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch top scorers
        const scorersQuery = query(
          collection(db, 'stats'),
          orderBy('goals', 'desc'),
          limit(5)
        )
        
        // Fetch top assists
        const assistsQuery = query(
          collection(db, 'stats'),
          orderBy('assists', 'desc'),
          limit(5)
        )
        
        // Fetch top clean sheets
        const cleanSheetsQuery = query(
          collection(db, 'stats'),
          orderBy('cleanSheets', 'desc'),
          limit(5)
        )

        const fetchPlayerData = async (statsSnapshot: any) => {
          const playerData: CombinedPlayerData[] = []

          for (const statDoc of statsSnapshot.docs) {
            const statsData = statDoc.data()
            // Fetch corresponding player info
            const playerDoc = await getDoc(doc(db, 'playerInfo', statsData.player_id))
            const playerInfo = playerDoc.data()

            if (playerInfo) {
              // Find team for this player
              const teamsRef = collection(db, 'teams')
              const teamQuery = query(teamsRef, where('players', 'array-contains', statsData.player_id))
              const teamSnapshot = await getDocs(teamQuery)
              const teamName = !teamSnapshot.empty ? teamSnapshot.docs[0].data().teamName : 'No Team'

              playerData.push({
                stats: statsData,
                info: {
                  ...playerInfo as PlayerInfo,
                  teamName
                }
              })
            }
          }

          return playerData
        }

        const [scorersSnapshot, assistsSnapshot, cleanSheetsSnapshot] = await Promise.all([
          getDocs(scorersQuery),
          getDocs(assistsQuery),
          getDocs(cleanSheetsQuery)
        ])

        const [scorersData, assistsData, cleanSheetsData] = await Promise.all([
          fetchPlayerData(scorersSnapshot),
          fetchPlayerData(assistsSnapshot),
          fetchPlayerData(cleanSheetsSnapshot)
        ])

        setTopScorers(scorersData)
        setTopAssists(assistsData)
        setTopCleanSheets(cleanSheetsData)

        // Add team data query
        const teamsQuery = query(
          collection(db, 'teams'),
          orderBy('winRate', 'desc')
        )
        const teamsSnapshot = await getDocs(teamsQuery)
        const teamsData = teamsSnapshot.docs.map(doc => doc.data() as TeamData)
        setAllTeamData(teamsData)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handlePlayerClick = async (player: CombinedPlayerData) => {
    setSelectedPlayer(player)
    console.log("player_id", player.stats.player_id)
    try {
      // Query to find the team that contains this player's ID
      const teamsRef = collection(db, 'teams')
      const q = query(teamsRef, where('players', 'array-contains', player.stats.player_id))
      const teamSnapshot = await getDocs(q)
      
      if (!teamSnapshot.empty) {
        const teamDoc = teamSnapshot.docs[0].data() as TeamData;
        // Convert winRate to percentage before setting
        const formattedTeamData = {
          ...teamDoc,
          winRate: teamDoc.winRate * 100 // Convert to percentage
        };
        setTeamData(formattedTeamData);
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
    }
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
        <p className="text-theme-background mt-4 animate-pulse">Loading stats...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme-dark relative overflow-hidden">
      <Navbar user={user || null} auth={auth} />

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

      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="grid gap-8">
          {/* Add Team Stats Card before other cards
          <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
            <CardHeader>
              <CardTitle className="text-theme-background">Team Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-theme-background">Team Name</TableHead>
                    <TableHead className="text-theme-background">Location</TableHead>
                    <TableHead className="text-theme-background">League</TableHead>
                    <TableHead className="text-theme-background">Win Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allTeamData.map((team, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-theme-light">{team.teamName}</TableCell>
                      <TableCell className="text-theme-light">{team.location}</TableCell>
                      <TableCell className="text-theme-light">{team.league ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-theme-light">{(team.winRate * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card> */}

          {/* Top Scorers */}
          <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
            <CardHeader>
              <CardTitle className="text-theme-background">Top Goal Scorers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-theme-background">Rank</TableHead>
                    <TableHead className="text-theme-background">Player</TableHead>
                    <TableHead className="text-theme-background">Position</TableHead>
                    <TableHead className="text-theme-background">Goals</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topScorers.map((player, index) => (
                    <TableRow 
                      key={index} 
                      className="cursor-pointer hover:bg-theme-accent/10"
                      onClick={() => handlePlayerClick(player)}
                    >
                      <TableCell className="text-theme-light">{index + 1}</TableCell>
                      <TableCell className="text-theme-light">
                        {player.info.fullName} ({player.info.teamName})
                      </TableCell>
                      <TableCell className="text-theme-light">{player.info.preferredPosition}</TableCell>
                      <TableCell className="text-theme-light">{player.stats.goals}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Top Assists */}
          <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
            <CardHeader>
              <CardTitle className="text-theme-background">Top Assists</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-theme-background">Rank</TableHead>
                    <TableHead className="text-theme-background">Player</TableHead>
                    <TableHead className="text-theme-background">Position</TableHead>
                    <TableHead className="text-theme-background">Assists</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topAssists.map((player, index) => (
                    <TableRow 
                      key={index} 
                      className="cursor-pointer hover:bg-theme-accent/10"
                      onClick={() => handlePlayerClick(player)}
                    >
                      <TableCell className="text-theme-light">{index + 1}</TableCell>
                      <TableCell className="text-theme-light">
                        {player.info.fullName} ({player.info.teamName})
                      </TableCell>
                      <TableCell className="text-theme-light">{player.info.preferredPosition}</TableCell>
                      <TableCell className="text-theme-light">{player.stats.assists}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Clean Sheets */}
          <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
            <CardHeader>
              <CardTitle className="text-theme-background">Top Clean Sheets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-theme-background">Rank</TableHead>
                    <TableHead className="text-theme-background">Player</TableHead>
                    <TableHead className="text-theme-background">Position</TableHead>
                    <TableHead className="text-theme-background">Clean Sheets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCleanSheets.map((player, index) => (
                    <TableRow 
                      key={index} 
                      className="cursor-pointer hover:bg-theme-accent/10"
                      onClick={() => handlePlayerClick(player)}
                    >
                      <TableCell className="text-theme-light">{index + 1}</TableCell>
                      <TableCell className="text-theme-light">
                        {player.info.fullName} ({player.info.teamName})
                      </TableCell>
                      <TableCell className="text-theme-light">{player.info.preferredPosition}</TableCell>
                      <TableCell className="text-theme-light">{player.stats.cleanSheets}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer 
        logo="KickHub"
        description="Revolutionizing the way football enthusiasts connect, play, and compete."
        quickLinks={['Book a Game', 'Player Stats', 'Merchandise', 'About Us']}
        gameFormats={['5v5 Format', '6v6 Format', '11v11 Format', 'Custom Games']}
      />

      {selectedPlayer && (
        <PlayerModal
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          player={selectedPlayer}
          teamData={teamData}
        />
      )}
    </div>
  )
}
