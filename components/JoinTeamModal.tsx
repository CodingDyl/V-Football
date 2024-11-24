'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from '@/firebase/clientApp'
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { toast } from "sonner"

interface JoinTeamModalProps {
  isOpen: boolean
  onClose: () => void
  playerId?: string
}

export function JoinTeamModal({ isOpen, onClose, playerId }: JoinTeamModalProps) {
  const [teamCode, setTeamCode] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleJoinTeam = async () => {
    if (!playerId) {
      toast.error('Player profile not found')
      return
    }

    setLoading(true)
    try {
      // Query teams collection for the team code
      const teamsRef = collection(db, 'teams')
      const q = query(teamsRef, where('joinCode', '==', teamCode.toUpperCase()))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        toast.error('Invalid team code')
        return
      }

      const teamDoc = querySnapshot.docs[0]
      const teamData = teamDoc.data()

      // Check if player is already in the team
      if (teamData.players?.includes(playerId)) {
        toast.error('You are already a member of this team')
        return
      }

      // Add player to team
      await updateDoc(doc(db, 'teams', teamDoc.id), {
        players: arrayUnion(playerId)
      })

      toast.success('Successfully joined team')
      onClose()
      router.refresh() // Refresh the page to show updated team info
    } catch (error) {
      console.error('Error joining team:', error)
      toast.error('Failed to join team')
    } finally {
      setLoading(false)
    }
  }

  const handleBrowseTeams = () => {
    router.push('/teams')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-theme-dark border border-theme-accent">
        <DialogHeader>
          <DialogTitle className="text-theme-background">Join a Team</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-theme-light">Enter team code:</div>
            <Input
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="Enter 8-digit team code"
              className="bg-theme-dark/50 border-theme-accent text-theme-background"
            />
            <Button
              onClick={handleJoinTeam}
              disabled={loading || !teamCode}
              className="w-full bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
            >
              {loading ? 'Joining...' : 'Join Team'}
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-theme-accent" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-theme-dark px-2 text-theme-light">Or</span>
            </div>
          </div>

          <Button
            onClick={handleBrowseTeams}
            className="w-full bg-theme-primary text-theme-dark hover:bg-theme-light"
          >
            Browse Teams
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 