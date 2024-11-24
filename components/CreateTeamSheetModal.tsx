'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/clientApp'
import { toast } from "sonner"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface Player {
  id: string
  fullName: string
  preferredPosition: string
}

interface Match {
  id: string
  opponent: string
  format: '5v5' | '6v6' | '11v11'
  substitutesEnabled: boolean
  requiredPlayers: number
}

interface Props {
  isOpen: boolean
  onClose: () => void
  match: Match
  players: Player[]
  onCreate: (teamSheet: any) => Promise<void>
}

const MATCH_FORMATS = {
  '5v5': {
    formations: ['1-2-2', '1-3-1', '1-2-1-1'],
    players: 5
  },
  '6v6': {
    formations: ['1-2-1-2', '1-2-3', '1-3-2'],
    players: 6
  },
  '11v11': {
    formations: ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '5-3-2'],
    players: 11
  }
} as const;

type FormationType = typeof MATCH_FORMATS[keyof typeof MATCH_FORMATS]['formations'][number];

export function CreateTeamSheetModal({ isOpen, onClose, match, players, onCreate }: Props) {
  const [formation, setFormation] = useState<FormationType>(MATCH_FORMATS[match.format].formations[0])
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [substitutes, setSubstitutes] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(selectedPlayers)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedPlayers(items)
  }

  const handlePlayerSelect = (player: Player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id))
    } else {
      setSelectedPlayers([...selectedPlayers, player])
    }
  }

  const handleSubmit = async () => {
    if (selectedPlayers.length !== match.requiredPlayers) {
      toast.error(`Please select exactly ${match.requiredPlayers} players`)
      return
    }

    setLoading(true)
    try {
      const teamSheetData = {
        matchId: match.id,
        formation,
        players: selectedPlayers.map(p => p.id),
        substitutes: match.substitutesEnabled ? substitutes.map(p => p.id) : [],
        created: new Date().toISOString(),
      }

      const teamSheetRef = doc(collection(db, 'teamSheets'))
      await setDoc(teamSheetRef, teamSheetData)

      toast.success('Team sheet created successfully')
      onCreate(teamSheetData)
      onClose()
    } catch (error) {
      console.error('Error creating team sheet:', error)
      toast.error('Failed to create team sheet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-theme-dark border border-theme-accent max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-theme-background">
            Create Team Sheet - {match.opponent}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-theme-background">Formation</Label>
            <Select 
              value={formation} 
              onValueChange={(value: FormationType) => setFormation(value)}>
              <SelectTrigger className="bg-theme-dark/50 border-theme-accent text-theme-light">
                <SelectValue placeholder="Select formation" />
              </SelectTrigger>
              <SelectContent className="bg-theme-dark border-theme-accent">
                {MATCH_FORMATS[match.format].formations.map((f) => (
                  <SelectItem key={f} value={f} className="text-theme-light">
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-theme-background mb-2">Available Players</h3>
              <div className="space-y-2">
                {players
                  .filter(player => !selectedPlayers.find(p => p.id === player.id))
                  .map((player) => (
                    <Button
                      key={player.id}
                      onClick={() => handlePlayerSelect(player)}
                      variant="outline"
                      className="w-full justify-start text-theme-light border-theme-accent"
                    >
                      {player.fullName} - {player.preferredPosition}
                    </Button>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-theme-background mb-2">Selected Players</h3>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="selected-players">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {selectedPlayers.map((player, index) => (
                        <Draggable key={player.id} draggableId={player.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between bg-theme-dark/50 p-2 border border-theme-accent rounded-md"
                            >
                              <span className="text-theme-light">
                                {index + 1}. {player.fullName}
                              </span>
                              <Button
                                onClick={() => handlePlayerSelect(player)}
                                variant="ghost"
                                className="text-theme-accent hover:text-theme-light"
                              >
                                ✕
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-theme-accent bg-theme-accent text-white hover:bg-theme-dark hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || selectedPlayers.length !== match.requiredPlayers}
              className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
            >
              {loading ? 'Creating...' : 'Create Team Sheet'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 