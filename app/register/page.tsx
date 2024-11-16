'use client'

import { RegisterForm } from "@/components/ui/register-form"
import { SparklesCore } from "@/components/ui/sparkles"

export default function RegisterPage() {
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

      <div className="min-h-screen w-full flex items-center justify-center relative z-10">
        <RegisterForm />
      </div>
    </div>
  )
} 