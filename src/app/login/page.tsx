// src/app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/header';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!auth) {
        toast({ variant: 'destructive', title: 'Error', description: 'Firebase not initialized.'});
        return;
    }
    setIsLoading(true);
    try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: 'Login Successful', description: "Welcome back! Redirecting to your dashboard..."});
        router.push('/dashboard');
    } catch (error: any) {
        console.error('Login error:', error);
        let description = 'An unexpected error occurred. Please try again.';
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            description = 'No account found with these credentials. Please check your email and password or sign up.';
            break;
          case 'auth/too-many-requests':
            description = 'Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.';
            break;
          default:
            description = 'An error occurred during login. Please try again.';
            break;
        }
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: description
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Log In
                </Button>
                <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/onboarding" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
      }
