'use client';
import Link from 'next/link';
import {
  Bell,
  Home,
  LogOut,
  PlusCircle,
  Settings,
  User,
  Medal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ReportIssueForm } from '@/components/city-voice/report-issue-form';
import { CityVoiceLogo } from '@/components/city-voice/logo';
import { mockUsers } from '@/lib/data';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, you'd get the current user from session/context
  const currentUser = mockUsers['a042581f4e29026704d'];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <nav className="flex items-center gap-2 text-lg font-medium md:text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <CityVoiceLogo className="h-7 w-7" />
            <span className="font-headline text-xl">CityVoice</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <Medal className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">{currentUser.tokens}</span>
            <span className="text-sm text-muted-foreground">Tokens</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Report New Issue</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className='font-headline'>Report a New Issue</SheetTitle>
                <SheetDescription>
                  Fill out the form below to submit a new civic issue. Please provide as much detail as possible.
                </SheetDescription>
              </SheetHeader>
              <ReportIssueForm />
            </SheetContent>
          </Sheet>

          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatarUrl} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
              <DropdownMenuItem><Home className="mr-2 h-4 w-4" />My Reports</DropdownMenuItem>
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/"><LogOut className="mr-2 h-4 w-4" />Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
