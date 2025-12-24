'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, ChevronRight, Lock, Trash2, User } from 'lucide-react';

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

export default function SettingsPage() {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    // Panggil API untuk hapus akun
    // await fetch('/api/delete-account', { method: 'POST' });

    alert('Account deleted!'); // ganti dengan logic API
    router.push('/'); // Redirect ke homepage
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
            className="hover:bg-muted flex items-center justify-between px-4 py-5"
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
            className="hover:bg-muted flex items-center justify-between px-4 py-5"
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
              <div className="flex cursor-pointer items-center gap-3 px-4 py-5 text-red-600 hover:bg-red-100">
                <div className="p-2">
                  <Trash2 size={20} />
                </div>
                <span className="font-semibold">Delete Account</span>
              </div>
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
    </>
  );
}
