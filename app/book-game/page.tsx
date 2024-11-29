'use client'

import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/clientApp'
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { SparklesCore } from "@/components/ui/sparkles"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Star } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Add province type and array
const provinces = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
] as const

type Province = typeof provinces[number]

// Dummy data - replace with real data later
const venues: Venue[] = [
  {
    id: 1,
    name: "PowerLeague Shoreditch",
    location: "London, E1",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.1",
    pricePerGame: 80,
    phone: "+44 20 7123 4567",
    rating: 4.5,
    reviews: 128,
    description: "Premium 5-a-side facilities in the heart of East London. Multiple pitches available with floodlights and changing rooms.",
    amenities: ["Floodlights", "Changing Rooms", "Parking", "Bar"],
    province: "Gauteng",
  },
  {
    id: 2,
    name: "Goals Manchester",
    location: "Manchester, M12",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.1",
    pricePerGame: 65,
    phone: "+44 161 123 4567",
    rating: 4.2,
    reviews: 95,
    description: "State-of-the-art football facility featuring both indoor and outdoor pitches.",
    amenities: ["Indoor Pitches", "Cafe", "Pro Shop", "Free Parking"],
    province: "Western Cape",
  },
  // Add more venues as needed
]

interface Venue {
  id: number
  name: string
  location: string
  image: string
  pricePerGame: number
  phone: string
  rating: number
  reviews: number
  description: string
  amenities: string[]
  province: Province
}

export default function BookGame() {
  const [user] = useAuthState(auth)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<Province | "all">("all")

  // Add filter function
  const filteredVenues = venues.filter(venue => 
    selectedProvince === "all" || venue.province === selectedProvince
  )

  return (
    <div className="min-h-screen bg-theme-dark relative flex flex-col">
      <Navbar 
        user={user ? { email: user.email, photoURL: user.photoURL } : null} 
        auth={auth} 
        logo="KickHub" 
      />

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

      <div className="relative z-10 container mx-auto px-4 py-24 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-theme-background">Book a Venue</h1>
          
          <Select
            value={selectedProvince}
            onValueChange={(value) => setSelectedProvince(value as Province | "all")}
          >
            <SelectTrigger className="w-[180px] bg-theme-dark/50 backdrop-blur-sm border-theme-accent text-theme-background">
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent className="bg-theme-dark border-theme-accent text-theme-background">
              <SelectItem value="all">All Provinces</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                onClick={() => setSelectedVenue(venue)}
                className="group cursor-pointer perspective"
              >
                <div className="relative preserve-3d hover:rotate-y-3 transition-transform duration-500 ease-out">
                  <div className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent rounded-lg overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-theme-background mb-1">
                        {venue.name}
                      </h3>
                      <p className="text-theme-light">{venue.location}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm text-theme-background">
                            {venue.rating} ({venue.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-xl text-theme-background text-center">
              We are unable to find any available venues at this time! Please check back later.
            </p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedVenue} onOpenChange={() => setSelectedVenue(null)}>
        <DialogContent className="bg-theme-dark border border-theme-accent text-theme-background max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedVenue?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <img
              src={selectedVenue?.image}
              alt={selectedVenue?.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-theme-light">{selectedVenue?.location}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Price</h3>
                <p className="text-theme-light">£{selectedVenue?.pricePerGame} per game</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Contact</h3>
                <p className="text-theme-light">{selectedVenue?.phone}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Description</h3>
                <p className="text-theme-light">{selectedVenue?.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVenue?.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 bg-theme-accent/10 text-theme-accent rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer 
        logo="KickHub"
        description="Revolutionizing the way football enthusiasts connect, play, and compete."
        quickLinks={['Book a Game', 'Player Stats', 'Merchandise', 'About Us']}
        gameFormats={['5v5 Format', '6v6 Format', '11v11 Format', 'Custom Games']}
      />
    </div>
  )
}
