'use client'

import { useState } from "react"
import { Button } from "./button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card"
import { Input } from "./input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import Link from "next/link"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Add your registration logic here
    
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <Card className="w-[400px] bg-theme-dark/50 backdrop-blur-sm border border-theme-accent">
      <CardHeader>
        <CardTitle className="text-2xl text-theme-background">Create an account</CardTitle>
        <CardDescription className="text-theme-light">
          Enter your details to register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="First Name"
                  disabled={isLoading}
                  required
                  className="bg-theme-dark/50 text-white"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Last Name"
                  disabled={isLoading}
                  required
                  className="bg-theme-dark/50 text-white"
                />
              </div>
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                disabled={isLoading}
                required
                className="bg-theme-dark/50 text-white"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                disabled={isLoading}
                required
                className="bg-theme-dark/50 text-white"
              />
            </div>
            {/* <div>
              <Select disabled={isLoading} required>
                <SelectTrigger className="bg-theme-dark/50">
                  <SelectValue placeholder="Preferred Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GK">Goalkeeper (GK)</SelectItem>
                  <SelectItem value="DEF">Defender (DEF)</SelectItem>
                  <SelectItem value="MID">Midfielder (MID)</SelectItem>
                  <SelectItem value="ST">Striker (ST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select disabled={isLoading} required>
                <SelectTrigger className="bg-theme-dark/50">
                  <SelectValue placeholder="Preferred Foot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <Button 
              className="w-full bg-theme-accent text-white hover:bg-theme-dark border border-theme-light rounded-none rounded-tl-lg rounded-tr-lg" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-center text-sm text-theme-light">
              Already have an account?{" "}
              <Link href="/login" className="text-theme-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 