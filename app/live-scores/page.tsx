'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SparklesCore } from "@/components/ui/sparkles"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/clientApp'
import { format } from 'date-fns'
import { LoadingSpinner } from '@/app/components/ui/loading-spinner'

interface Match {
  id: number
  homeTeam: {
    name: string
    crest: string
  }
  awayTeam: {
    name: string
    crest: string
  }
  status: string
  utcDate: string
  score: {
    fullTime: {
      home: number | null
      away: number | null
    }
  }
}

interface League {
  id: string
  name: string
  code: string
}

interface Standing {
  position: number
  team: {
    name: string
    crest: string
  }
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalDifference: number
}

const leagues: League[] = [
  { id: "2021", name: "Premier League", code: "PL" },
  { id: "2002", name: "Bundesliga", code: "BL1" },
  { id: "2014", name: "La Liga", code: "PD" },
]

export default function LiveScoresPage() {
  const [user] = useAuthState(auth)
  const [selectedLeague, setSelectedLeague] = useState<League>(leagues[0])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [standings, setStandings] = useState<Standing[]>([])
  const [matchesError, setMatchesError] = useState<string | null>(null)
  const [standingsError, setStandingsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      setMatchesError(null)
      try {
        const response = await fetch(
          `/api/football?leagueId=${selectedLeague.id}&type=matches`
        )
        if (!response.ok) throw new Error('Failed to fetch matches')
        const data = await response.json()
        setMatches(data.matches || [])
      } catch (error) {
        console.error('Error fetching matches:', error)
        setMatchesError('Unable to retrieve match data. Please try again later.')
      }
      setLoading(false)
    }

    fetchMatches()
  }, [selectedLeague])

  useEffect(() => {
    const fetchStandings = async () => {
      setStandingsError(null)
      try {
        const response = await fetch(
          `/api/football?leagueId=${selectedLeague.id}&type=standings`
        )
        if (!response.ok) throw new Error('Failed to fetch standings')
        const data = await response.json()
        setStandings(data.standings?.[0]?.table || [])
      } catch (error) {
        console.error('Error fetching standings:', error)
        setStandingsError('Unable to retrieve standings data. Please try again later.')
      }
    }

    fetchStandings()
  }, [selectedLeague])

  return (
    <div className="min-h-screen bg-theme-dark relative flex flex-col">
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

      <Navbar user={user ? { email: user.email, photoURL: user.photoURL } : null} auth={auth} logo="KickHub" />

      <div className="relative z-10 container mx-auto px-4 py-8 flex-grow mt-16">
        <div className="mb-8">
          <Select
            onValueChange={(value) => {
              const league = leagues.find(l => l.id === value)
              if (league) setSelectedLeague(league)
            }}
            defaultValue={selectedLeague.id}
          >
            <SelectTrigger className="w-full md:w-[280px] bg-theme-dark/50 backdrop-blur-sm border border-theme-accent text-theme-background">
              <SelectValue placeholder="Select League" />
            </SelectTrigger>
            <SelectContent className="bg-theme-dark border border-theme-accent">
              {leagues.map((league) => (
                <SelectItem 
                  key={league.id} 
                  value={league.id}
                  className="text-theme-background hover:bg-theme-accent/20"
                >
                  {league.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-8">
          {/* Recent Matches */}
          <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
            <CardHeader>
              <CardTitle className="text-theme-background">Recent Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {loading ? (
                  <LoadingSpinner />
                ) : matchesError ? (
                  <div className="text-theme-background text-center p-4">{matchesError}</div>
                ) : (
                  matches
                    .filter(match => match.status === 'FINISHED')
                    .slice(-5)
                    .map((match) => (
                      <div 
                        key={match.id}
                        className="flex items-center justify-between p-4 bg-theme-dark/30 rounded-lg border border-theme-accent/30"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <img src={match.homeTeam.crest} alt="" className="w-8 h-8" />
                          <span className="text-theme-background">{match.homeTeam.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4">
                          <span className="text-theme-background text-lg font-bold">
                            {match.score.fullTime.home} - {match.score.fullTime.away}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 flex-1 justify-end">
                          <span className="text-theme-background">{match.awayTeam.name}</span>
                          <img src={match.awayTeam.crest} alt="" className="w-8 h-8" />
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Matches */}
          <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
            <CardHeader>
              <CardTitle className="text-theme-background">Upcoming Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {loading ? (
                  <LoadingSpinner />
                ) : matchesError ? (
                  <div className="text-theme-background text-center p-4">{matchesError}</div>
                ) : (
                  matches
                    .filter(match => match.status === 'SCHEDULED')
                    .slice(0, 5)
                    .map((match) => (
                      <div 
                        key={match.id}
                        className="flex items-center justify-between p-4 bg-theme-dark/30 rounded-lg border border-theme-accent/30"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <img src={match.homeTeam.crest} alt="" className="w-8 h-8" />
                          <span className="text-theme-background">{match.homeTeam.name}</span>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          <span className="text-theme-background text-sm">
                            {format(new Date(match.utcDate), 'MMM dd, HH:mm')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 flex-1 justify-end">
                          <span className="text-theme-background">{match.awayTeam.name}</span>
                          <img src={match.awayTeam.crest} alt="" className="w-8 h-8" />
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent my-8 mx-20">
        <CardHeader>
          <CardTitle className="text-theme-background">League Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <LoadingSpinner />
            ) : standingsError ? (
              <div className="text-theme-background text-center p-4">{standingsError}</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-theme-background text-left">
                    <th className="p-2">Pos</th>
                    <th className="p-2">Team</th>
                    <th className="p-2">P</th>
                    <th className="p-2">W</th>
                    <th className="p-2">D</th>
                    <th className="p-2">L</th>
                    <th className="p-2">GD</th>
                    <th className="p-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing) => (
                    <tr key={standing.team.name} className="text-theme-background border-t border-theme-accent/30">
                      <td className="p-2">{standing.position}</td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <img src={standing.team.crest} alt="" className="w-6 h-6" />
                          <span>{standing.team.name}</span>
                        </div>
                      </td>
                      <td className="p-2">{standing.playedGames}</td>
                      <td className="p-2">{standing.won}</td>
                      <td className="p-2">{standing.draw}</td>
                      <td className="p-2">{standing.lost}</td>
                      <td className="p-2">{standing.goalDifference}</td>
                      <td className="p-2 font-bold">{standing.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      <Footer />
    </div>
  )
}
