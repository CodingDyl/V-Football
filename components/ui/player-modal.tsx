import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface CombinedPlayerData {
  info: {
    fullName: string
    jerseyNumber: number
    preferredPosition: string
  }
  stats: {
    goals: number
    assists: number
    cleanSheets: number
    yellowCards: number
    redCards: number
  }
}

interface TeamData {
  kitColor: string
  league: boolean
  location: string
  teamName: string
  winRate: number
}

interface PlayerModalProps {
  isOpen: boolean
  onClose: () => void
  player: CombinedPlayerData
  teamData: TeamData | null
}

export function PlayerModal({ isOpen, onClose, player, teamData }: PlayerModalProps) {
  console.log('Team Data:', teamData);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-theme-dark/90 backdrop-blur-sm border border-theme-accent">
        <DialogHeader>
          <DialogTitle className="text-theme-background">
            {player.info.fullName} (#{player.info.jerseyNumber})
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          {/* Player Info */}
          <Card className="bg-theme-dark/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-theme-light">
                <div>Position: {player.info.preferredPosition}</div>
                <div>Goals: {player.stats.goals}</div>
                <div>Assists: {player.stats.assists}</div>
                <div>Clean Sheets: {player.stats.cleanSheets}</div>
                <div>Yellow Cards: {player.stats.yellowCards}</div>
                <div>Red Cards: {player.stats.redCards}</div>
              </div>
            </CardContent>
          </Card>

          {/* Team Info */}
          {teamData && (
            <Card className="bg-theme-dark/50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-theme-light">
                  <div>Team: {teamData.teamName}</div>
                  <div>Location: {teamData.location}</div>
                  <div>Kit Color: {teamData.kitColor}</div>
                  <div>Win Rate: {teamData.winRate}%</div>
                  <div>League: {teamData.league ? 'Yes' : 'No'}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 