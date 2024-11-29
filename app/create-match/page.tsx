"use client";
import { useState } from "react";
// import { useSession } from "next-auth/react";
import { generateUniqueLink } from "@/lib/utils";
import { soccer_pitch } from "../assets";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { db } from '@/firebase/clientApp';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

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
  date: string;
  time: string;
  autoAssignPositions: boolean;
  ownerName: string;
}

export default function CreateMatch() {
  const router = useRouter();
  const [user] = useAuthState(auth);
//   const { data: session } = useSession();
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    format: "5v5",
    maxPlayers: 10,
    allowSubs: false,
    subsLimit: 0,
    location: "",
    date: "",
    time: "",
    autoAssignPositions: false,
    ownerName: user?.displayName || "",
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

  const handleCreateMatch = async () => {
    try {
      const dateTime = new Date(`${gameSettings.date}T${gameSettings.time}`);
      
      const matchesRef = collection(db, 'friendlyMatches');
      const matchDoc = await addDoc(matchesRef, {
        ...gameSettings,
        dateTime: dateTime,
        createdAt: new Date(),
        createdBy: user?.email || 'anonymous',
        ownerName: gameSettings.ownerName || (user?.displayName || user?.email?.split('@')[0] || 'Anonymous'),
        players: [],
        teams: null,
        status: 'open'
      });

      router.push(`/match/${matchDoc.id}`);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  return (
    <div className="min-h-screen bg-theme-dark relative overflow-hidden flex flex-col">
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

      <Navbar 
        user={user ? { email: user.email, photoURL: user.photoURL } : null} 
        auth={auth} 
        logo="KickHub" 
      />

      <div className="container mx-auto p-4 relative z-10 pt-20 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-theme-background">Create Match</h1>
        
        {/* Game Settings Card */}
        <Card className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent mb-6">
          <CardHeader>
            <CardTitle className="text-theme-background">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                value={gameSettings.format}
                onChange={(e) => setGameSettings({
                  ...gameSettings,
                  format: e.target.value as GameSettings['format'],
                  maxPlayers: e.target.value === "5v5" ? 10 : e.target.value === "6v6" ? 12 : 22
                })}
                className="bg-theme-dark/50 text-theme-background border border-theme-accent/20 rounded-tl-lg p-2"
              >
                <option value="5v5">5 vs 5</option>
                <option value="6v6">6 vs 6</option>
                <option value="11v11">11 vs 11</option>
              </select>

              <div>
                <input
                  type="date"
                  value={gameSettings.date}
                  onChange={(e) => setGameSettings({
                    ...gameSettings,
                    date: e.target.value
                  })}
                  className="bg-theme-dark/50 text-theme-background border border-theme-accent/20 rounded-tl-lg p-2 w-full"
                />
              </div>

              <div>
                <input
                  type="time"
                  value={gameSettings.time}
                  onChange={(e) => setGameSettings({
                    ...gameSettings,
                    time: e.target.value
                  })}
                  className="bg-theme-dark/50 text-theme-background border border-theme-accent/20 rounded-tl-lg p-2 w-full"
                />
              </div>

              <input
                type="text"
                placeholder="Location"
                value={gameSettings.location}
                onChange={(e) => setGameSettings({
                  ...gameSettings,
                  location: e.target.value
                })}
                className="bg-theme-dark/50 text-theme-background border border-theme-accent/20 rounded-tl-lg p-2"
              />

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={gameSettings.allowSubs}
                    onChange={(e) => setGameSettings({
                      ...gameSettings,
                      allowSubs: e.target.checked
                    })}
                    className="accent-theme-accent"
                  />
                  <span className="text-theme-background">Allow Subs</span>
                </label>

                {gameSettings.allowSubs && (
                  <input
                    type="number"
                    placeholder="Subs limit"
                    value={gameSettings.subsLimit}
                    onChange={(e) => setGameSettings({
                      ...gameSettings,
                      subsLimit: parseInt(e.target.value)
                    })}
                    className="bg-theme-dark/50 text-theme-background border border-theme-accent/20 rounded-tl-lg p-2 w-24"
                  />
                )}
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={gameSettings.autoAssignPositions}
                  onChange={(e) => setGameSettings({
                    ...gameSettings,
                    autoAssignPositions: e.target.checked
                  })}
                  className="accent-theme-accent"
                />
                <span className="text-theme-background">Auto-assign Positions</span>
              </label>

              <div>
                <input
                  type="text"
                  placeholder="Match Owner Name"
                  value={gameSettings.ownerName}
                  onChange={(e) => setGameSettings({
                    ...gameSettings,
                    ownerName: e.target.value
                  })}
                  className="bg-theme-dark/50 text-theme-background border border-theme-accent/20 rounded-tl-lg p-2 w-full"
                />
                {user && (
                  <Button
                    onClick={() => setGameSettings({
                      ...gameSettings,
                      ownerName: user.displayName || user.email?.split('@')[0] || ""
                    })}
                    className="bg-theme-accent/50 text-white hover:bg-theme-accent mt-2"
                    size="sm"
                  >
                    Use My Name
                  </Button>
                )}
              </div>
            </div>

            <Button
              onClick={handleCreateMatch}
              className="bg-theme-accent text-white hover:bg-theme-primary w-full mt-4"
            >
              Create Match
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer 
        logo="KickHub"
        description="Revolutionizing the way football enthusiasts connect, play, and compete."
        quickLinks={['Book a Game', 'Player Stats', 'Merchandise', 'About Us']}
        gameFormats={['5v5 Format', '6v6 Format', '11v11 Format', 'Custom Games']}
        className="mt-auto"
      />
    </div>
  );
} 