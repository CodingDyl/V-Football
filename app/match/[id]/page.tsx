'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { soccer_pitch } from "../../assets";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PlayerInfo } from '@/types/player';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Player {
  name: string;
  position?: string;
  initials: string;
}

interface GameSettings {
  format: "5v5" | "6v6" | "11v11";
  maxPlayers: number;
  allowSubs: boolean;
  subsLimit?: number;
  location: string;
  dateTime: string;
  autoAssignPositions: boolean;
  ownerName: string;
}

interface Match {
  id: string;
  gameSettings: GameSettings;
  players: Player[];
  teams: { teamA: Player[]; teamB: Player[] } | null;
  status: string;
}

export default function MatchPage() {
  const { id } = useParams();
  const [user] = useAuthState(auth);
  const [match, setMatch] = useState<Match | null>(null);
  const [guestName, setGuestName] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [editSettings, setEditSettings] = useState<GameSettings | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerInfo | null>(null);

  const positions_5v5 = [
    { id: "gk", label: "GK", x: "50%", y: "90%" },
    { id: "cb", label: "CB", x: "20%", y: "80%" },
    { id: "cb", label: "CB", x: "80%", y: "80%" },
    { id: "cm", label: "CM", x: "50%", y: "70%" },
    { id: "st", label: "ST", x: "50%", y: "55%" },
    // Back positions
    { id: "gk", label: "GK", x: "50%", y: "10%" },
    { id: "cb", label: "CB", x: "80%", y: "20%" },
    { id: "cb", label: "CB", x: "20%", y: "20%" },
    { id: "cm", label: "CM", x: "50%", y: "30%" },
    { id: "st", label: "ST", x: "50%", y: "45%" },
  ];

  const positions_6v6 = [
    { id: "gk", label: "GK", x: "50%", y: "90%" },
    { id: "cb", label: "CB", x: "20%", y: "80%" },
    { id: "cb", label: "CB", x: "80%", y: "80%" },
    { id: "cm", label: "CM", x: "50%", y: "70%" },
    { id: "st", label: "ST", x: "55%", y: "55%" },
    { id: "st", label: "ST", x: "45%", y: "55%" },
    // Back positions
    { id: "gk", label: "GK", x: "50%", y: "10%" },
    { id: "cb", label: "CB", x: "80%", y: "20%" },
    { id: "cb", label: "CB", x: "20%", y: "20%" },
    { id: "cm", label: "CM", x: "50%", y: "30%" },
    { id: "st", label: "ST", x: "55%", y: "45%" },
    { id: "st", label: "ST", x: "45%", y: "45%" },
  ];

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        console.log("Fetching match with ID:", id);
        const matchDoc = await getDoc(doc(db, 'friendlyMatches', id as string));
        
        if (matchDoc.exists()) {
          const data = matchDoc.data();
          console.log("Raw match data:", data);
          
          // Handle different date formats
          let formattedDateTime;
          if (data.dateTime?.toDate) {
            // If it's a Firestore timestamp
            formattedDateTime = data.dateTime.toDate().toISOString();
          } else if (data.dateTime instanceof Date) {
            // If it's a JavaScript Date object
            formattedDateTime = data.dateTime.toISOString();
          } else {
            // If it's already a string or other format, use as is
            formattedDateTime = data.dateTime;
          }
          
          // Restructure the data to match our interface
          const matchData: Match = {
            id: matchDoc.id,
            gameSettings: {
              format: data.format,
              maxPlayers: data.maxPlayers,
              allowSubs: data.allowSubs,
              subsLimit: data.subsLimit,
              location: data.location,
              dateTime: formattedDateTime,
              autoAssignPositions: data.autoAssignPositions,
              ownerName: data.ownerName
            },
            players: data.players || [],
            teams: data.teams,
            status: data.status
          };
          
          console.log("Processed match data:", matchData);
          setMatch(matchData);
        }
      } catch (error) {
        console.error("Error fetching match:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatch();
  }, [id]);

  useEffect(() => {
    if (user?.displayName) {
      setGuestName(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      if (!user) return;

      try {
        const playerInfoQuery = query(
          collection(db, 'playerInfo'),
          where('userId', '==', user.uid)
        );

        const playerInfoSnapshot = await getDocs(playerInfoQuery);

        if (!playerInfoSnapshot.empty) {
          const playerData = playerInfoSnapshot.docs[0].data();
          setPlayerProfile({
            id: playerInfoSnapshot.docs[0].id,
            ...playerData
          } as PlayerInfo);
        }
      } catch (error) {
        console.error('Error fetching player profile:', error);
      }
    };

    fetchPlayerProfile();
  }, [user]);

  const handleJoinGame = async () => {
    if (!match) return;
    
    const playerName = user?.displayName || guestName;
    if (!playerName) {
      alert("Please enter your name to join the game");
      return;
    }

    if (match.players.some(player => player.name === playerName)) {
      alert("You have already joined this game");
      return;
    }

    if (match.players.length >= match.gameSettings.maxPlayers) {
      alert("This game is full");
      return;
    }

    const initials = playerName
      .split(" ")
      .map(n => n[0])
      .join("");

    const newPlayer: Player = { 
      name: playerName, 
      initials
    };
    
    if (selectedPosition) {
      newPlayer.position = selectedPosition;
    }

    try {
      const matchRef = doc(db, 'friendlyMatches', id as string);
      await updateDoc(matchRef, {
        players: [...match.players, newPlayer]
      });

      setMatch({
        ...match,
        players: [...match.players, newPlayer]
      });
      
      if (!user) {
        setGuestName("");
      }
      setSelectedPosition(null);
    } catch (error) {
      console.error("Error joining game:", error);
      alert("Failed to join game. Please try again.");
    }
  };

  const generateTeams = async () => {
    if (!match || match.players.length < match.gameSettings.maxPlayers) return;
    
    const shuffledPlayers = [...match.players].sort(() => Math.random() - 0.5);
    const teamSize = match.gameSettings.maxPlayers / 2;
    
    const newTeams = {
      teamA: shuffledPlayers.slice(0, teamSize),
      teamB: shuffledPlayers.slice(teamSize, match.gameSettings.maxPlayers),
    };

    try {
      const matchRef = doc(db, 'friendlyMatches', id as string);
      await updateDoc(matchRef, { teams: newTeams });
      setMatch({
        ...match,
        teams: newTeams
      });
    } catch (error) {
      console.error("Error generating teams:", error);
    }
  };

  const handleEditMatch = () => {
    router.push(`/match/${id}/edit`);
  };

  const handleDeleteMatch = async () => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;

    try {
      const matchRef = doc(db, 'friendlyMatches', id as string);
      await deleteDoc(matchRef);
      router.push('/matches'); // Redirect to matches list
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  const handleUpdateSettings = async () => {
    if (!editSettings || !match) return;

    try {
      const matchRef = doc(db, 'friendlyMatches', id as string);
      await updateDoc(matchRef, {
        format: editSettings.format,
        maxPlayers: editSettings.maxPlayers,
        allowSubs: editSettings.allowSubs,
        subsLimit: editSettings.subsLimit,
        location: editSettings.location,
        dateTime: editSettings.dateTime,
        autoAssignPositions: editSettings.autoAssignPositions
      });

      setMatch({
        ...match,
        gameSettings: editSettings
      });
    } catch (error) {
      console.error("Error updating match settings:", error);
    }
  };

  const getPositionsForFormat = (format: string) => {
    switch (format) {
      case "5v5":
        return positions_5v5;
      case "6v6":
        return positions_6v6;
      default:
        return null;
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (!match || !match.gameSettings) {
    return <div>Error: Match not found</div>;
  }

  return (
    <div className="min-h-screen bg-theme-dark relative overflow-hidden">
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

      <Navbar 
        user={user ? { email: user.email, photoURL: user.photoURL } : null} 
        auth={auth} 
        logo="KickHub" 
      />

      <div className="container mx-auto p-4 pt-20 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-theme-background">Match Details</h1>

        {/* Match Info Card */}
        <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent mb-6">
          <CardHeader>
            <CardTitle className="text-theme-background">Game Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-theme-background">
            <p>Format: {match.gameSettings.format}</p>
            <p>Location: {match.gameSettings.location}</p>
            <p>Date & Time: {new Date(match.gameSettings.dateTime).toLocaleString()}</p>
            <p>Players: {match.players.length}/{match.gameSettings.maxPlayers}</p>
            <p>Match Owner: {match.gameSettings.ownerName}</p>
            {match.gameSettings.allowSubs && (
              <p>Substitutes Allowed: {match.gameSettings.subsLimit} max</p>
            )}
          </CardContent>
        </Card>

        {/* Join Game Section */}
        <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={user ? "Your name will be added automatically" : "Enter your name"}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                disabled={!!user}
                className="bg-theme-dark/50 text-theme-background border border-theme-accent/20 rounded-tl-lg p-2 flex-1"
              />
              <Button
                onClick={handleJoinGame}
                className="bg-theme-accent text-white hover:bg-theme-primary"
              >
                Join Game
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Soccer Field - Only show for 5v5 and 6v6 */}
        {match.gameSettings.format !== "11v11" && (
          <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent mb-6">
            <CardContent className="p-0">
              <div className="relative w-full aspect-video bg-green-600 rounded-lg overflow-hidden">
                <img 
                  src={soccer_pitch.src} 
                  alt="soccer pitch" 
                  className="w-full h-full object-fill" 
                />
                {getPositionsForFormat(match.gameSettings.format)?.map((pos) => (
                  <div
                    key={`${pos.id}-${pos.x}-${pos.y}`}
                    style={{ left: pos.x, top: pos.y }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    onClick={() => !match.gameSettings.autoAssignPositions && setSelectedPosition(pos.id)}
                  >
                    <div className={`w-12 h-12 rounded-full bg-theme-dark/80 border-2 
                      ${selectedPosition === pos.id ? 'border-theme-primary' : 'border-theme-accent'} 
                      text-theme-background flex items-center justify-center cursor-pointer 
                      hover:bg-theme-accent hover:text-white transition-colors`}
                    >
                      {match.players.find(p => p.position === pos.id)?.initials || pos.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Player List & Teams */}
        <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
          <CardHeader>
            <CardTitle className="text-theme-background">
              Players ({match.players.length}/{match.gameSettings.maxPlayers})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {match.teams ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-theme-background font-semibold mb-2">Team A</h3>
                  <div className="flex flex-wrap gap-2">
                    {match.teams.teamA.map((player, index) => (
                      <div 
                        key={index} 
                        className="bg-theme-dark/30 px-4 py-2 rounded-lg text-theme-background hover:bg-theme-accent/30 transition-colors"
                      >
                        {player.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-theme-background font-semibold mb-2">Team B</h3>
                  <div className="flex flex-wrap gap-2">
                    {match.teams.teamB.map((player, index) => (
                      <div 
                        key={index} 
                        className="bg-theme-dark/30 px-4 py-2 rounded-lg text-theme-background hover:bg-theme-accent/30 transition-colors"
                      >
                        {player.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {match.players.map((player, index) => (
                  <div 
                    key={index} 
                    className="bg-theme-dark/30 px-4 py-2 rounded-lg text-theme-background hover:bg-theme-accent/30 transition-colors"
                  >
                    {player.name}
                    {playerProfile && player.name === playerProfile.fullName && (
                      <div className="text-sm text-theme-light mt-1">
                        <p>Jersey Number: {playerProfile.jerseyNumber}</p>
                        <p>Position: {playerProfile.preferredPosition}</p>
                        <p>Preferred Foot: {playerProfile.preferredFoot}</p>
                        <p>Fitness Level: {playerProfile.fitnessLevel}</p>
                        <p>Injury Status: {playerProfile.injuryStatus}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {match.players.length >= match.gameSettings.maxPlayers && !match.teams && (
              <Button
                onClick={generateTeams}
                className="bg-theme-accent text-white hover:bg-theme-primary mt-4 w-full"
              >
                Generate Random Teams
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent mt-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="flex-1 bg-theme-accent text-white hover:bg-theme-primary"
                    onClick={() => setEditSettings(match?.gameSettings || null)}
                  >
                    Edit Match
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-theme-dark text-theme-background">
                  <DialogHeader>
                    <DialogTitle>Edit Match Settings</DialogTitle>
                  </DialogHeader>
                  {editSettings && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Format</Label>
                        <Select
                          value={editSettings.format}
                          onValueChange={(value: "5v5" | "6v6" | "11v11") => {
                            const maxPlayers = value === "5v5" ? 10 : value === "6v6" ? 12 : 22;
                            setEditSettings({ 
                              ...editSettings, 
                              format: value,
                              maxPlayers: maxPlayers
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5v5">5v5</SelectItem>
                            <SelectItem value="6v6">6v6</SelectItem>
                            <SelectItem value="11v11">11v11</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={editSettings.location}
                          onChange={(e) => setEditSettings({ 
                            ...editSettings, 
                            location: e.target.value 
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Date & Time</Label>
                        <Input
                          type="datetime-local"
                          value={editSettings.dateTime.slice(0, 16)}
                          onChange={(e) => setEditSettings({ 
                            ...editSettings, 
                            dateTime: new Date(e.target.value).toISOString() 
                          })}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editSettings.allowSubs}
                          onCheckedChange={(checked) => setEditSettings({ 
                            ...editSettings, 
                            allowSubs: checked 
                          })}
                        />
                        <Label>Allow Substitutes</Label>
                      </div>

                      {editSettings.allowSubs && (
                        <div className="space-y-2">
                          <Label>Substitutes Limit</Label>
                          <Input
                            type="number"
                            value={editSettings.subsLimit}
                            onChange={(e) => setEditSettings({ 
                              ...editSettings, 
                              subsLimit: parseInt(e.target.value) 
                            })}
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editSettings.autoAssignPositions}
                          onCheckedChange={(checked) => setEditSettings({ 
                            ...editSettings, 
                            autoAssignPositions: checked 
                          })}
                        />
                        <Label>Auto-assign Positions</Label>
                      </div>

                      <Button 
                        onClick={handleUpdateSettings}
                        className="w-full bg-theme-accent text-white hover:bg-theme-primary"
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button
                onClick={handleDeleteMatch}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Delete Match
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer 
        logo="KickHub"
        description="Revolutionizing the way football enthusiasts connect, play, and compete."
        quickLinks={['Book a Game', 'Player Stats', 'Merchandise', 'About Us']}
        gameFormats={['5v5 Format', '6v6 Format', '11v11 Format', 'Custom Games']}
      />
    </div>
  );
} 