'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from 'firebase/auth'
import { Auth } from 'firebase/auth'

interface NavbarProps {
  user: {
    email: string | null;
    photoURL: string | null;
  } | null;
  auth: Auth;
  logo?: string;
  isManager?: boolean;
}

export function Navbar({ user, auth, logo = "KickHub", isManager = false }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-theme-dark/80 backdrop-blur-sm border-b border-theme-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-theme-background font-bold text-xl">
            {logo}
          </Link>

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
            {user && isManager && (
              <Link href="/manage-team" className="text-theme-background hover:text-theme-primary transition-colors">
                Manage Team
              </Link>
            )}
            {user ? (
              <>
                <Link href="/player-info" className="text-theme-background hover:text-theme-primary transition-colors">
                  Player Info
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
                      <AvatarImage 
                        src={user.photoURL || ''} 
                        alt={user.email || 'User avatar'} 
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-theme-dark border border-theme-accent/20">
                    <DropdownMenuItem className="text-theme-background hover:text-theme-primary cursor-pointer">
                      <Link href="/account" className="w-full">
                        Edit Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-theme-background hover:text-theme-primary cursor-pointer"
                      onClick={() => signOut(auth)}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-theme-accent text-white hover:bg-theme-dark border border-theme-light rounded-none rounded-tl-lg rounded-tr-lg px-4">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 