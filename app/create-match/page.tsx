"use client";
import { useState } from "react";
// import { useSession } from "next-auth/react";
import { generateUniqueLink } from "@/lib/utils";
import { soccer_pitch } from "../assets";

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
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [guestName, setGuestName] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  
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
    // }
  };

  const generateTeams = () => {
    if (players.length < gameSettings.maxPlayers) return;
    
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const teamSize = gameSettings.maxPlayers / 2;
    
    return {
      teamA: shuffledPlayers.slice(0, teamSize),
      teamB: shuffledPlayers.slice(teamSize, gameSettings.maxPlayers),
    };
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Match</h1>
      
      {/* Game Settings */}
      <div className="mb-6">
        <select 
          value={gameSettings.gameType}
          onChange={(e) => setGameSettings({
            ...gameSettings,
            gameType: e.target.value,
            maxPlayers: e.target.value === "5v5" ? 10 : 12
          })}
          className="border rounded p-2"
        >
          <option value="5v5">5 vs 5</option>
          <option value="6v6">6 vs 6</option>
        </select>
      </div>

      {/* Join Game Section */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter your name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <button
          onClick={handleJoinGame}
          className="bg-theme-accent text-white px-4 py-2 rounded"
        >
          Join as Guest
        </button>
      </div>

      {/* Soccer Field */}
      <div className="relative w-full h-100vh bg-green-600 rounded-lg">
        <img 
          src={soccer_pitch.src} 
          alt="soccer pitch" 
          className="w-full h-full object-contain object-bottom" 
        />
        {positions.map((pos) => (
          <div
            key={pos.id}
            style={{ left: pos.x, top: pos.y }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center cursor-pointer">
              {players.find(p => p.position === pos.id)?.initials || pos.label}
            </div>
          </div>
        ))}
      </div>

      {/* Player List & Teams */}
      <div className="mt-4">
        <h2 className="text-xl font-bold">Players ({players.length}/{gameSettings.maxPlayers})</h2>
        {/* Add player list display */}
      </div>

      {players.length >= gameSettings.maxPlayers && !gameSettings.isLeague && (
        <button
          onClick={generateTeams}
          className="bg-theme-accent text-white px-4 py-2 rounded mt-4"
        >
          Generate Random Teams
        </button>
      )}
    </div>
  );
} 