'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from '@/firebase/clientApp'
import { doc, updateDoc } from 'firebase/firestore'
import { PlayerInfo } from '@/types/player'
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface EditPlayerFormProps {
  playerInfo: PlayerInfo
  onSuccess: () => void
}

export function EditPlayerForm({ playerInfo, onSuccess }: EditPlayerFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: playerInfo.fullName,
    jerseyNumber: playerInfo.jerseyNumber,
    preferredPosition: playerInfo.preferredPosition,
    preferredFoot: playerInfo.preferredFoot,
    fitnessLevel: playerInfo.fitnessLevel,
    injuryStatus: playerInfo.injuryStatus,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const playerDoc = doc(db, 'playerInfo', playerInfo.id)
      await updateDoc(playerDoc, formData)
      toast.success("Player profile updated successfully")
      onSuccess()
    } catch (error) {
      console.error('Error updating player:', error)
      toast.error("Failed to update player profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-theme-light">Full Name</label>
        <Input
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          className="bg-theme-dark/50 border-theme-accent text-theme-background"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-theme-light">Jersey Number</label>
        <Input
          value={formData.jerseyNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, jerseyNumber: e.target.value }))}
          className="bg-theme-dark/50 border-theme-accent text-theme-background"
        />
      </div>

      <div className="space-y-2">
        <label className="text-theme-light">Position</label>
        <Select 
          value={formData.preferredPosition}
          onValueChange={(value) => setFormData(prev => ({ ...prev, preferredPosition: value }))}
        >
          <SelectTrigger className="bg-theme-dark/50 border-theme-accent text-theme-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Forward">Forward</SelectItem>
            <SelectItem value="Midfielder">Midfielder</SelectItem>
            <SelectItem value="Defender">Defender</SelectItem>
            <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-theme-light">Preferred Foot</label>
        <Select 
          value={formData.preferredFoot}
          onValueChange={(value) => setFormData(prev => ({ ...prev, preferredFoot: value }))}
        >
          <SelectTrigger className="bg-theme-dark/50 border-theme-accent text-theme-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Left">Left</SelectItem>
            <SelectItem value="Right">Right</SelectItem>
            <SelectItem value="Both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-theme-light">Fitness Level</label>
        <Select 
          value={formData.fitnessLevel}
          onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessLevel: value }))}
        >
          <SelectTrigger className="bg-theme-dark/50 border-theme-accent text-theme-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Extremely Fit">Extremely Fit</SelectItem>
            <SelectItem value="I can run">I can run</SelectItem>
            <SelectItem value="Haven't played in a while">Haven't played in a while</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="I'm not fit">I'm not fit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-theme-light">Injury Status</label>
        <Select 
          value={formData.injuryStatus}
          onValueChange={(value) => setFormData(prev => ({ ...prev, injuryStatus: value }))}
        >
          <SelectTrigger className="bg-theme-dark/50 border-theme-accent text-theme-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fit">Fit</SelectItem>
            <SelectItem value="Injured">Injured</SelectItem>
            <SelectItem value="Recovering">Recovering</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="submit" 
          className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  )
} 