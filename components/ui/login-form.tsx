'use client'

import { useState } from 'react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleSignIn = async () => {
    const { user, error } = await signInWithGoogle();
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Successfully signed in with Google!');
    router.push('/');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { user, error } = isSignUp 
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);
    
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(isSignUp ? 'Account created successfully!' : 'Successfully signed in!');
    router.push('/');
  };

  return (
    <div className="bg-theme-dark border border-theme-light p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl text-white font-bold mb-6 text-center">
        {isSignUp ? 'Create Account' : 'Sign In'}
      </h2>
      
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-gray-300 p-2 rounded flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>
      </div>

      <p className="mt-4 text-center text-white">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 ml-2 hover:underline"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
} 