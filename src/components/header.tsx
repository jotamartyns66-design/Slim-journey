// src/components/header.tsx
'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Rocket, LogOut, User, LayoutDashboard, LogIn, Eye } from 'lucide-react';
import { useAuth, useUser } from '@/firebase'; // CORREÇÃO
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


function getInitials(name: string | null | undefined) {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
        return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
}


export function Header() {
  const { user, isSignedOut, isLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
        await signOut(auth);
        router.push('/login');
    }
  };
  
  const headerClasses = "sticky top-0 z-50 flex items-center justify-between h-16 px-4 shrink-0 md:px-6";
  const backdropClasses = "bg-white/30 dark:bg-black/20 backdrop-blur-lg border-b border-white/20 dark:border-black/20";


  if (isLoading) {
    return (
        <header className={`${headerClasses} bg-white/30 dark:bg-black/20`}>
            <Logo />
            <div className="h-8 w-24 bg-black/10 dark:bg-white/10 rounded-md animate-pulse"></div>
        </header>
    )
  }

  return (
    <header className={`${headerClasses} ${isSignedOut ? 'bg-transparent border-b-0' : backdropClasses}`}>
      <Logo />
      {isSignedOut ? (
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
                <Link href="/preview">
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                </Link>
            </Button>
          <Button asChild variant="ghost">
            <Link href="/login">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/onboarding">
              Sign Up
            </Link>
          </Button>
        </div>
      ) : user ? (
        <div className="flex items-center gap-4">
            <Button asChild size="sm" variant="secondary" className="bg-accent/90 text-accent-foreground hover:bg-accent">
                <Link href="/pricing">
                <Rocket className="w-4 h-4 mr-2" />
                Upgrade
                </Link>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border-2 border-white/50">
                            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                        </p>
                    </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      ) : null}
    </header>
  );
              }
