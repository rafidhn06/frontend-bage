'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  ArrowLeft,
  ChevronRight,
  Lock,
  LogOut,
  Trash2,
  User,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import api from '@/lib/axios';

export default function SettingsPage() {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/auth/account');
      toast.success('Akun berhasil dihapus');
      router.push('/login');
    } catch (error) {
      console.error('Delete account failed:', error);
      toast.error('Gagal menghapus akun. Silakan coba lagi');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Berhasil keluar (logout)');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Gagal keluar. Silakan coba lagi');
    }
  };

  return (
    <>
      <TopBar className="flex w-full items-center gap-3 p-4 text-xl font-semibold">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </Button>
        Settings
      </TopBar>
      <main className="flex flex-col items-center">
        <div className="divide-border w-full max-w-xl divide-y divide-solid">
          <Link
            href="/settings/profile"
            className="hover:bg-accent/40 focus-visible:bg-accent/40 focus:inset-ring-ring/50 flex h-22 items-center justify-between px-4 py-5 transition-colors focus:outline-none focus-visible:inset-ring-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Profile</span>
                <span className="text-muted-foreground text-sm">
                  Edit your and profile picture, username, full name, and bio
                </span>
              </div>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </Link>

          <Link
            href="/settings/account"
            className="hover:bg-accent/40 focus-visible:bg-accent/40 focus:inset-ring-ring/50 flex h-22 items-center justify-between px-4 py-5 transition-colors focus:outline-none focus-visible:inset-ring-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2">
                <Lock size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Account</span>
                <span className="text-muted-foreground text-sm">
                  Edit your email and password
                </span>
              </div>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex h-22 w-full cursor-pointer items-center gap-3 px-4 py-5 text-yellow-500 transition-colors hover:bg-yellow-300/10 focus:inset-ring-yellow-300/40 focus:outline-none focus-visible:bg-yellow-300/10 focus-visible:inset-ring-2">
                <div className="p-2">
                  <LogOut size={20} />
                </div>
                <span className="font-semibold">Log Out</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  Are you sure you want to logout from your account?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex h-22 w-full cursor-pointer items-center gap-3 px-4 py-5 text-red-500 transition-colors hover:bg-red-500/10 focus-visible:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:outline-none">
                <div className="p-2">
                  <Trash2 size={20} />
                </div>
                <span className="font-semibold">Delete Account</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Toaster richColors position="top-right" style={{ top: '68px' }} />
    </>
  );
}
