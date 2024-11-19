'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SparklesCore } from "@/components/ui/sparkles"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { format_1, format_2, format_3, format_4, hero_football } from '@/app/assets'
import { Carousel } from '@/components/ui/apple-cards-carousel'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase/clientApp';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from 'firebase/auth'
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { useState } from 'react'
import { useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'

interface User {
  email: string;
  photoURL: string;
}

export default function LandingPage() {
  const [user] = useAuthState(auth);

  const words = "Organize matches, create balanced teams, and play beautiful football"
  
  const formats = [
    {
      title: "5v5 Format",
      description: "Perfect for intense, fast-paced matches on smaller pitches",
      link: "/book/5v5",
      image: format_1.src,
      background: "bg-green-500/10"
    },
    {
      title: "6v6 Format",
      description: "Ideal balance of space and action for medium-sized fields",
      link: "/book/6v6",
      image: format_2.src,
      background: "bg-blue-500/10"
    },
    {
      title: "11v11 Format",
      description: "Traditional full-sized football experience",
      link: "/book/11v11",
      image: format_3.src,
      background: "bg-purple-500/10"
    },
    {
      title: "Custom Format",
      description: "Choose your own team sizes and setup",
      link: "/book/custom",
      image: format_4.src,
      background: "bg-orange-500/10"
    },
  ];

  console.log("User Photo URL -> ", user?.photoURL);

  return (
    <div className="min-h-screen bg-theme-dark relative overflow-hidden">
      <Navbar user={user ? { email: user.email, photoURL: user.photoURL } : null} auth={auth} logo="KickHub" />

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

      <div className="min-h-screen w-full relative">
        {/* Updated Hero Section */}
        <div className="relative h-screen w-full">
          {/* Full-screen background image with gradient overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-theme-dark via-theme-dark/80 to-transparent z-10" />
            <img 
              src={hero_football.src} 
              alt="Football" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hero content */}
          <div className="relative z-20 h-full">
            <div className="h-full w-full flex items-center">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center max-w-2xl">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                    Unleash Your Inner Champion
                  </h1>
                  <div className="text-theme-background mb-8">
                    <TextGenerateEffect words={words} className="text-xl" />
                  </div>
                  <div className="flex gap-4">
                    {user ? (
                      <>
                      <Link href="/create-match">
                        <Button size="lg" 
                          className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light rounded-none rounded-tl-lg rounded-tr-lg">
                          Create a Match
                        </Button>
                      </Link>
                      <Link href="/join-team">
                      <Button size="lg" 
                        className="bg-theme-primary hover:bg-theme-light text-theme-dark rounded-none rounded-tl-lg rounded-tr-lg">
                        Join a Team
                      </Button>
                    </Link>
                    </>
                    ) : (
                      <>
                        <Link href="/login">
                          <Button size="lg" 
                            className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light rounded-none rounded-tl-lg rounded-tr-lg">
                            Login
                          </Button>
                        </Link>
                        <Link href="/login">
                          <Button size="lg" 
                            className="bg-theme-primary hover:bg-theme-light text-theme-dark rounded-none rounded-tl-lg rounded-tr-lg">
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add this new section before or after the Features Section */}
        <div className="py-16 relative px-4 sm:px-8 md:px-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-theme-background mb-4">Choose Your Format</h2>
            <p className="text-theme-background text-lg">Select the perfect match format for your team</p>
          </div>
          <div className="h-auto w-full">
            <Carousel items={formats} />
          </div>
        </div>

        {/* Features Section with Modern Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 px-4 sm:px-8 md:px-16">
          {[
            {
              title: "Easy Booking",
              content: "Book your spot in upcoming matches with just a few clicks",
              icon: "⚽"
            },
            {
              title: "Smart Team Generation",
              content: "Our algorithm creates balanced teams based on positions and skill levels",
              icon: "🎯"
            },
            {
              title: "Multiple Formats",
              content: "Choose from 5v5, 6v6, or 11v11 matches to suit your preferences",
              icon: "🏆"
            }
          ].map((feature, index) => (
            <Card key={index} 
              className="bg-theme-dark/50 backdrop-blur-sm border border-theme-accent hover:border-theme-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-theme-background">{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-theme-light">
                {feature.content}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center relative px-4 sm:px-8 md:px-16 pb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-theme-primary/10 to-theme-navy/10 blur-3xl" />
          <h2 className="text-4xl font-bold text-theme-background mb-8 relative">
            Ready to Play?
          </h2>
          <Link href="/football-booking">
            <Button size="lg" 
              className="bg-theme-primary hover:bg-theme-light text-theme-dark font-semibold px-8 py-6 text-lg animate-float">
              Book a Match Now
            </Button>
          </Link>
        </div>

        {/* Footer Section */}
        <Footer 
          logo="KickHub"
          description="Revolutionizing the way football enthusiasts connect, play, and compete."
          quickLinks={['Book a Game', 'Player Stats', 'Merchandise', 'About Us']}
          gameFormats={['5v5 Format', '6v6 Format', '11v11 Format', 'Custom Games']}
        />
      </div>
    </div>
  )
}