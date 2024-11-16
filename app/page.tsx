import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SparklesCore } from "@/components/ui/sparkles"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { format_1, format_2, format_3, format_4, hero_football } from '@/app/assets'
import { Carousel } from '@/components/ui/apple-cards-carousel'

export default function LandingPage() {
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

  return (
    <div className="min-h-screen bg-theme-dark relative overflow-hidden">
      {/* Navbar remains the same, just moved inside the main container */}
      <nav className="fixed top-0 w-full z-50 bg-theme-dark/80 backdrop-blur-sm border-b border-theme-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-theme-background font-bold text-xl">
              KickHub
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/book" className="text-theme-background hover:text-theme-primary transition-colors">
                Book a Game
              </Link>
              <Link href="/stats" className="text-theme-background hover:text-theme-primary transition-colors">
                Player Stats
              </Link>
              <Link href="/shop" className="text-theme-background hover:text-theme-primary transition-colors">
                Merchandise
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light rounded-none rounded-tl-lg rounded-tr-lg px-4">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
                    <Link href="/login">
                      <Button size="lg" 
                        className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light rounded-none rounded-tl-lg rounded-tr-lg">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="lg" 
                        className="bg-theme-primary hover:bg-theme-light text-theme-dark rounded-none rounded-tl-lg rounded-tr-lg">
                        Sign Up
                      </Button>
                    </Link>
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
        <footer className="relative border-t border-theme-accent/20 bg-theme-dark/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo and Description */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-theme-background">KickHub</h3>
                <p className="text-theme-light text-sm">
                  Revolutionizing the way football enthusiasts connect, play, and compete.
                </p>
                <div className="flex space-x-4">
                  {/* Social Media Icons */}
                  <a href="#" className="text-theme-light hover:text-theme-primary transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-theme-light hover:text-theme-primary transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-theme-background font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  {['Book a Game', 'Player Stats', 'Merchandise', 'About Us'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-theme-light hover:text-theme-primary transition-colors text-sm">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Game Formats */}
              <div>
                <h3 className="text-theme-background font-semibold mb-4">Game Formats</h3>
                <ul className="space-y-2">
                  {['5v5 Format', '6v6 Format', '11v11 Format', 'Custom Games'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-theme-light hover:text-theme-primary transition-colors text-sm">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-theme-background font-semibold mb-4">Stay Updated</h3>
                <p className="text-theme-light text-sm mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-theme-dark/50 text-theme-light px-4 py-2 rounded-tl-lg border border-theme-accent/20 focus:outline-none focus:border-theme-primary"
                  />
                  <button className="bg-theme-accent px-4 py-2 text-white hover:bg-theme-primary transition-colors rounded-tr-lg">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-theme-accent/20">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-theme-light text-sm">
                  © 2024 KickHub. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-theme-light hover:text-theme-primary text-sm">Privacy Policy</a>
                  <a href="#" className="text-theme-light hover:text-theme-primary text-sm">Terms of Service</a>
                  <a href="#" className="text-theme-light hover:text-theme-primary text-sm">Contact Us</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}