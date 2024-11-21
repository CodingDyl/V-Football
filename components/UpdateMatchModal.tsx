'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/clientApp'
import { toast } from "sonner"

interface PlayerStats {
  goals: number
  assists: number
  cleanSheets: number
  yellowCards: number
  redCards: number
}

interface Player {
  id: string
  fullName: string
  stats?: PlayerStats
}

interface Match {
  id: string
  date: string
  opponent: string
  status: 'upcoming' | 'completed'
  score?: {
    home: number
    away: number
  }
}

interface Props {
  isOpen: boolean
  onClose: () => void
  match: Match
  players: Player[]
  onUpdate: (match: Match) => Promise<void>
}

export function UpdateMatchModal({ isOpen, onClose, match, players, onUpdate }: Props) {
  const [homeScore, setHomeScore] = useState(match.score?.home?.toString() || '0')
  const [awayScore, setAwayScore] = useState(match.score?.away?.toString() || '0')
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerStats>>({})
  const [loading, setLoading] = useState(false)

  const handlePlayerStatChange = (playerId: string, statType: keyof PlayerStats, value: string) => {
    setPlayerStats(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [statType]: parseInt(value) || 0
      }
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Update match score
      const matchRef = doc(db, 'matches', match.id)
      await updateDoc(matchRef, {
        score: {
          home: parseInt(homeScore),
          away: parseInt(awayScore)
        },
        status: 'completed'
      })

      // Update player stats
      for (const [playerId, stats] of Object.entries(playerStats)) {
        const playerStatsRef = doc(db, 'stats', playerId)
        const playerStatsDoc = await getDoc(playerStatsRef)

        if (playerStatsDoc.exists()) {
          const currentStats = playerStatsDoc.data()
          await updateDoc(playerStatsRef, {
            goals: (currentStats.goals || 0) + (stats.goals || 0),
            assists: (currentStats.assists || 0) + (stats.assists || 0),
            cleanSheets: (currentStats.cleanSheets || 0) + (stats.cleanSheets || 0),
            yellowCards: (currentStats.yellowCards || 0) + (stats.yellowCards || 0),
            redCards: (currentStats.redCards || 0) + (stats.redCards || 0),
          })
        } else {
          await setDoc(playerStatsRef, {
            goals: stats.goals || 0,
            assists: stats.assists || 0,
            cleanSheets: stats.cleanSheets || 0,
            yellowCards: stats.yellowCards || 0,
            redCards: stats.redCards || 0,
          })
        }
      }

      toast.success('Match updated successfully')
      onClose()
    } catch (error) {
      console.error('Error updating match:', error)
      toast.error('Failed to update match')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-theme-dark border border-theme-accent">
        <DialogHeader>
          <DialogTitle className="text-theme-background">Update Match Result</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-theme-background">Home Score</Label>
              <Input
                type="number"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="bg-theme-dark/50 border-theme-accent text-theme-light"
              />
            </div>
            <div>
              <Label className="text-theme-background">Away Score</Label>
              <Input
                type="number"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="bg-theme-dark/50 border-theme-accent text-theme-light"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-theme-background">Player Statistics</h3>
            {players.map((player) => (
              <div key={player.id} className="space-y-2">
                <h4 className="text-theme-light">{player.fullName}</h4>
                <div className="grid grid-cols-5 gap-2">
                  {['goals', 'assists', 'cleanSheets', 'yellowCards', 'redCards'].map((stat) => (
                    <div key={stat}>
                      <Label className="text-theme-background capitalize">
                        {stat.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={playerStats[player.id]?.[stat as keyof PlayerStats] || '0'}
                        onChange={(e) => handlePlayerStatChange(player.id, stat as keyof PlayerStats, e.target.value)}
                        className="bg-theme-dark/50 border-theme-accent text-theme-light"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-theme-accent text-theme-background"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
            >
              {loading ? 'Updating...' : 'Update Match'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 