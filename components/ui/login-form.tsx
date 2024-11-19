'use client'

import { useState, useEffect } from 'react';
import { signInWithGoogle } from '@/firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function LoginForm() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const { user, error } = await signInWithGoogle();
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Successfully signed in with Google!');
    router.push('/');
  };

  return (
    <div className="backdrop-blur-md bg-black/30 border border-white/10 p-8 rounded-2xl shadow-2xl w-96">
      <h2 className="text-3xl text-white font-bold mb-8 text-center">
        Login or Get Started!
      </h2>

      <button
        onClick={handleGoogleSignIn}
        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all duration-300 text-white"
      >
        <FcGoogle className="w-6 h-6" />
        Continue with Google
      </button>
    </div>
  );
} 