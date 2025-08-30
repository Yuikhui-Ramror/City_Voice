'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth, googleProvider } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, redirect to dashboard
        router.push('/dashboard');
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  // Handle countdown and redirect after successful email sign-up
  useEffect(() => {
    if (successMessage && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer); // Cleanup timer on unmount
    }
  }, [successMessage, countdown, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      setSuccessMessage(null);
      // Sign up with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      // Send verification email
      await sendEmailVerification(userCredential.user);
      // Show success message with countdown
      setSuccessMessage(`Verification email sent to ${values.email}! Please check your inbox. Redirecting to login in ${countdown} seconds...`);
      setCountdown(10); // Reset countdown
    } catch (error: any) {
      // Handle Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('An account already exists with this email.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email format.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        default:
          setError('An error occurred during sign-up. Please try again.');
      }
    }
  }

  async function handleGoogleSignUp() {
    try {
      setError(null);
      setSuccessMessage(null);
      setIsGoogleLoading(true);
      // Sign up with Google
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (error: any) {
      // Handle Google sign-up errors
      setError('Failed to sign up with Google. Please try again.');
      setIsGoogleLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "url('https://i.postimg.cc/JnzWrHg9/159-Z-2107-w026-n002-628-B-p1-628.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full p-2 max-w-[400px] bg-black/40 border border-white backdrop-blur-md">
        <div className="mb-8 flex items-center justify-center text-primary">
          <img 
            src="https://i.postimg.cc/HkDTCxtt/Chat-GPT-Image-Aug-30-2025-10-45-32-AM.png" 
            className="w-[200px] -mb-20"
            style={{
              filter: 'brightness(2.2)'
            }}
          />
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-xl text-white" style={{
            fontFamily: 'Poppins'
          }}>Citizen Sign Up</CardTitle>
          <CardDescription>
            <span className='text-[14px] text-white/70' style={{
              fontFamily: 'Poppins'
            }}>Create an account to report and track civic issues.</span>
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-3 -mt-4">
              {error && (
                <div className="text-red-500 text-[13px] text-left p-3 rounded-lg border border-red-500 bg-red-950/50 flex gap-2">
                  <AlertTriangle size={18} /> {error}
                </div>
              )}
              {successMessage && (
                <div className="text-green-500 text-[13px] text-left p-3 rounded-lg border border-green-500 bg-green-950/50 flex gap-2">
                  <CheckCircle2 size={18} /> {successMessage}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[13px] text-white/80' style={{
                      fontFamily: 'Poppins'
                    }}>Email or Aadhaar</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="bg-black/50 border-white/60 text-white focus:outline-none focus:ring-0"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-white/80'>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder='Enter password' 
                        className='bg-black/60 border-white/60 text-white' 
                        {...field} 
                        autoComplete="new-password" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-white/80'>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder='Confirm password' 
                        className='bg-black/60 border-white/60 text-white' 
                        {...field} 
                        autoComplete="new-password" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                type="submit" 
                className="w-full"
                disabled={!form.formState.isValid || successMessage !== null} // Disable if form is invalid or success message is shown
              >
                Sign Up
              </Button>
              <Button
                variant="outline"
                className="w-full border border-black/10 hover:bg-gray-200 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path 
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.07 7.57 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.57 1 4.01 3.93 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign Up with Google
                  </>
                )}
              </Button>
              <hr className='border-black/20 mt-1 mb-1 border-t w-full' />
              <Button className="w-full bg-black hover:bg-white hover:text-black">
                <Link href="/admin">Admin Portal Login</Link>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <p className="mt-4 text-xs text-white/60">
        Already have an account? <Link href="/" className="underline font-semibold hover:font-bold">Log in</Link>
      </p>
    </div>
  );
}