import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Timestamp } from 'firebase/firestore'

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (matchData: any) => Promise<void>;
  teamId: string;
  teamLocation: string;
}

export function CreateMatchModal({ isOpen, onClose, teamId, teamLocation, onCreate }: CreateMatchModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    awayTeam: '',
    matchLocation: teamLocation,
    friendly: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time into a timestamp
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
    };

    await onCreate(matchData);
    onClose();
    setFormData({
      date: '',
      time: '',
      awayTeam: '',
      matchLocation: teamLocation,
      friendly: false
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
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-theme-accent text-theme-background"
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