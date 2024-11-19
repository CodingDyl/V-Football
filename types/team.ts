interface TeamDocument {
    teamName: string;
    location: string;
    kitColor: string;
    league: boolean;
    winRate: number; // stored as decimal (e.g., 0.75 for 75%)
    players: string[]; // array of player IDs
  }