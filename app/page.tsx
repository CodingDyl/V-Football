import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SparklesCore } from "@/components/ui/sparkles"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { format_1, format_2, format_3, format_4 } from '@/app/assets'
import { Carousel } from '@/components/ui/apple-cards-carousel'

export default function LandingPage() {
  const words = "Organize matches, create balanced teams, and play beautiful football"
  
  const formats = [
    {
      title: "5v5 Format",
      description: "Perfect for intense, fast-paced matches on smaller pitches",
      link: "/book/5v5",
      image: format_1,
      background: "bg-green-500/10"
    },
    {
      title: "6v6 Format",
      description: "Ideal balance of space and action for medium-sized fields",
      link: "/book/6v6",
      image: format_2,
      background: "bg-blue-500/10"
    },
    {
      title: "11v11 Format",
      description: "Traditional full-sized football experience",
      link: "/book/11v11",
      image: format_3,
      background: "bg-purple-500/10"
    },
    {
      title: "Custom Format",
      description: "Choose your own team sizes and setup",
      link: "/book/custom",
      image: format_4,
      background: "bg-orange-500/10"
    },
  ];

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

      <div className="min-h-screen w-full relative">
        {/* Hero Section */}
        <div className="text-center mb-16 relative h-screen w-full">
          <div className="h-screen w-full bg-transparent flex flex-col items-center justify-center overflow-hidden rounded-md">
            {/* Background Video */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-0 w-full h-full">
                <iframe
                  className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src="https://www.youtube.com/embed/lG5fBDsSixM?autoplay=1&mute=1&loop=1&playlist=lG5fBDsSixM&controls=0&showinfo=0&rel=0&enablejsapi=1&widgetid=1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  frameBorder="0"
                ></iframe>
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </div>

            <div className="relative h-[200px] w-full flex items-center justify-center">
              <h1 className="md:text-7xl text-6xl lg:text-8xl font-bold text-white relative z-20">
                V-Football
              </h1>
            </div>

            <div className="w-full max-w-2xl mx-auto text-theme-background">
              <TextGenerateEffect words={words} className="text-xl text-theme-background mb-8" />
            </div>

            <div className="flex justify-center gap-4 mt-8 relative z-50">
              <Link href="/login">
                <Button size="lg" 
                  className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" 
                  className="bg-theme-primary hover:bg-theme-light text-theme-dark">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Add this new section before or after the Features Section */}
        <div className="py-16 relative px-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-theme-background mb-4">Choose Your Format</h2>
            <p className="text-theme-background text-lg">Select the perfect match format for your team</p>
          </div>
          <div className="h-auto w-full">
            <Carousel items={formats} />
          </div>
        </div>

        {/* Features Section with Modern Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 px-16">
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
        <div className="text-center relative px-16 pb-16">
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
      </div>
    </div>
  )
}