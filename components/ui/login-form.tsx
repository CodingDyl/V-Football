import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function LoginForm() {
  return (
    <div className="w-full max-w-md p-8 rounded-lg bg-theme-dark/50 backdrop-blur-sm border border-theme-accent/20">
      <h2 className="text-3xl font-bold text-theme-background mb-2">Welcome back</h2>
      <p className="text-theme-light mb-6">
        New to KickHub? <Link href="/register" className="text-theme-primary hover:underline">Create an account</Link>
      </p>
      
      <form className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            className="w-full bg-theme-dark/50 border-theme-accent/20 text-theme-background"
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="Password"
            className="w-full bg-theme-dark/50 border-theme-accent/20 text-theme-background"
          />
        </div>

        <div className="flex items-center justify-between">
          <Link href="/forgot-password" className="text-sm text-theme-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit"
          className="w-full bg-theme-primary hover:bg-theme-light text-theme-dark"
        >
          Sign in
        </Button>
      </form>
    </div>
  )
} 