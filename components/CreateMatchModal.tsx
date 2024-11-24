import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Timestamp } from 'firebase/firestore'

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (matchData: any) => Promise<void>;
  teamId: string;
  teamLocation: string;
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

export function CreateMatchModal({ isOpen, onClose, teamId, teamLocation, onCreate }: CreateMatchModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    awayTeam: '',
    matchLocation: teamLocation,
    friendly: false,
    format: '11v11' as keyof typeof MATCH_FORMATS,
    substitutesEnabled: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    const matchData = {
      homeTeam: teamId,
      awayTeam: formData.awayTeam,
      friendly: formData.friendly,
      matchDate: Timestamp.fromDate(dateTime),
      matchLocation: formData.matchLocation,
      status: 'upcoming',
      opponent: formData.awayTeam,
      date: dateTime.toISOString().split('T')[0],
      location: formData.matchLocation,
      format: formData.format,
      substitutesEnabled: formData.substitutesEnabled,
      requiredPlayers: MATCH_FORMATS[formData.format].players
    };

    await onCreate(matchData);
    onClose();
    setFormData({
      date: '',
      time: '',
      awayTeam: '',
      matchLocation: teamLocation,
      friendly: false,
      format: '11v11',
      substitutesEnabled: true
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-theme-dark/90 border border-theme-accent">
        <DialogHeader>
          <DialogTitle className="text-theme-background">Create New Match</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date" className="text-theme-background">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-theme-dark/50 text-theme-light border-theme-accent"
              required
            />
          </div>
          <div>
            <Label htmlFor="time" className="text-theme-background">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="bg-theme-dark/50 text-theme-light border-theme-accent"
              required
            />
          </div>
          <div>
            <Label htmlFor="format" className="text-theme-background">Match Format</Label>
            <Select 
              value={formData.format} 
              onValueChange={(value: keyof typeof MATCH_FORMATS) => 
                setFormData({ ...formData, format: value })
              }
            >
              <SelectTrigger className="bg-theme-dark/50 text-theme-light border-theme-accent">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-theme-dark border-theme-accent">
                {Object.keys(MATCH_FORMATS).map((format) => (
                  <SelectItem key={format} value={format} className="text-theme-light">
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="awayTeam" className="text-theme-background">Away Team</Label>
            <Input
              id="awayTeam"
              value={formData.awayTeam}
              onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
              className="bg-theme-dark/50 text-theme-light border-theme-accent"
              required
            />
          </div>
          <div>
            <Label htmlFor="matchLocation" className="text-theme-background">Match Location</Label>
            <Input
              id="matchLocation"
              value={formData.matchLocation}
              onChange={(e) => setFormData({ ...formData, matchLocation: e.target.value })}
              className="bg-theme-dark/50 text-theme-light border-theme-accent"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="friendly"
              checked={formData.friendly}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, friendly: checked as boolean })
              }
              className="border-theme-accent"
            />
            <Label htmlFor="friendly" className="text-theme-background">
              Friendly Match
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="substitutes"
              checked={formData.substitutesEnabled}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, substitutesEnabled: checked as boolean })
              }
              className="border-theme-accent"
            />
            <Label htmlFor="substitutes" className="text-theme-background">
              Enable Substitutes
            </Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-theme-accent bg-theme-accent text-white hover:bg-theme-dark hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light"
            >
              Create Match
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}