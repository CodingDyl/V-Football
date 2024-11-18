"use client";
import { useState } from "react";
// import { useSession } from "next-auth/react";
import { generateUniqueLink } from "@/lib/utils";
import { soccer_pitch } from "../assets";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";

interface Player {
  name: string;
  position?: string;
  initials: string;
}

export default function CreateMatch() {
//   const { data: session } = useSession();
  const [gameSettings, setGameSettings] = useState({
    maxPlayers: 10,
    gameType: "5v5",
    randomizePositions: false,
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [guestName, setGuestName] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [teams, setTeams] = useState<{ teamA: Player[]; teamB: Player[] } | null>(null);
  
  const positions = [
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

  const handleJoinGame = () => {
    // if (session) {
    //   // Add logged-in user
    //   const userInitials = session.user.name
    //     ?.split(" ")
    //     .map(n => n[0])
    //     .join("") || "??";
    //   setPlayers([...players, { name: session.user.name!, initials: userInitials }]);
    // } else if (guestName) {
      // Add guest user
      const initials = guestName
        .split(" ")
        .map(n => n[0])
        .join("");
      setPlayers([...players, { name: guestName, initials }]);
      setGuestName("");
    // }
  };

  const generateTeams = () => {
    if (players.length < gameSettings.maxPlayers) return;
    
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const teamSize = gameSettings.maxPlayers / 2;
    
    const newTeams = {
      teamA: shuffledPlayers.slice(0, teamSize),
      teamB: shuffledPlayers.slice(teamSize, gameSettings.maxPlayers),
    };
    setTeams(newTeams);
    return newTeams;
  };

  return (
    <div className="min-h-screen bg-theme-dark relative overflow-hidden">
      {/* Background Sparkles */}
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

      <div className="container mx-auto p-4 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-theme-background">Create Match</h1>
        
        {/* Game Settings Card */}
        <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent mb-6">
          <CardHeader>
            <CardTitle className="text-theme-background">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <select 
                value={gameSettings.gameType}
                onChange={(e) => setGameSettings({
                  ...gameSettings,
                  gameType: e.target.value,
                  maxPlayers: e.target.value === "5v5" ? 10 : 12
                })}
                className="bg-theme-dark/50 text-theme-background border border-theme-accent/20 rounded-tl-lg p-2"
              >
                <option value="5v5">5 vs 5</option>
                <option value="6v6">6 vs 6</option>
              </select>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="randomPositions"
                  checked={gameSettings.randomizePositions}
                  onChange={(e) => setGameSettings({
                    ...gameSettings,
                    randomizePositions: e.target.checked
                  })}
                  className="accent-theme-accent"
                />
                <label htmlFor="randomPositions" className="text-theme-background">
                  Randomize Positions
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Join Game Section */}
        <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
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

        {/* Soccer Field */}
        <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent mb-6">
          <CardContent className="p-0">
            <div className="relative w-full aspect-video bg-green-600 rounded-lg overflow-hidden">
              <img 
                src={soccer_pitch.src} 
                alt="soccer pitch" 
                className="w-full h-full object-fill" 
              />
              {positions.map((pos) => (
                <div
                  key={`${pos.id}-${pos.x}-${pos.y}`}
                  style={{ left: pos.x, top: pos.y }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-12 h-12 rounded-full bg-theme-dark/80 border-2 border-theme-accent text-theme-background flex items-center justify-center cursor-pointer hover:bg-theme-accent hover:text-white transition-colors">
                    {players.find(p => p.position === pos.id)?.initials || pos.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Player List & Teams */}
        <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
          <CardHeader>
            <CardTitle className="text-theme-background">
              Players ({players.length}/{gameSettings.maxPlayers})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teams ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-theme-background font-semibold mb-2">Team A</h3>
                  <div className="flex flex-wrap gap-2">
                    {teams.teamA.map((player, index) => (
                      <div 
                        key={index} 
                        className="bg-theme-dark/30 px-4 py-2 rounded-lg text-theme-background hover:bg-theme-accent/30 transition-colors cursor-pointer"
                      >
                        {player.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-theme-background font-semibold mb-2">Team B</h3>
                  <div className="flex flex-wrap gap-2">
                    {teams.teamB.map((player, index) => (
                      <div 
                        key={index} 
                        className="bg-theme-dark/30 px-4 py-2 rounded-lg text-theme-background hover:bg-theme-accent/30 transition-colors cursor-pointer"
                      >
                        {player.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {players.map((player, index) => (
                  <div 
                    key={index} 
                    className="bg-theme-dark/30 px-4 py-2 rounded-lg text-theme-background hover:bg-theme-accent/30 transition-colors cursor-pointer"
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            )}
            
            {players.length >= gameSettings.maxPlayers && (
              <Button
                onClick={generateTeams}
                className="bg-theme-accent text-white hover:bg-theme-primary mt-4 w-full"
              >
                Generate Random Teams
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 