'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, Settings } from 'lucide-react';

import NavigationBar from '@/components/NavigationBar';
import PostItem from '@/components/PostItem';
import TopBar from '@/components/TopBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const userProfile = {
  fullName: 'John Doe',
  username: '@johndoe',
  bio: 'Just an ordinary family man. Sometimes a doctor.',
  avatarUrl: 'https://github.com/shadcn.png',
  userInitials: 'JD',
  followersCount: 1543,
  followingCount: 42,
  postCount: 12,
};

const mockPosts = [1, 2, 3];

export default function ProfilePage() {
  const {
    fullName,
    avatarUrl,
    userInitials,
    followersCount,
    followingCount,
    postCount,
  } = userProfile;

  const router = useRouter();

  return (
    <>
      <TopBar className="text-md flex w-full items-center gap-3 truncate px-4 py-3 font-semibold tracking-tight">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back to previous page"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          {fullName}
          <span className="text-muted-foreground block text-sm font-normal">
            {postCount} posts
          </span>
        </div>
      </TopBar>

      <main className="xs:pb-[78px] flex items-center justify-center pb-[81px]">
        <div className="divide-border flex max-w-xl flex-col divide-y divide-solid">
          <div className="flex flex-col gap-4 px-4 py-6">
            <div className="flex justify-between">
              <Avatar className="size-20">
                <AvatarImage asChild src={avatarUrl}>
                  {avatarUrl && (
                    <Image
                      src={avatarUrl}
                      alt={`${fullName}'s profile`}
                      width={80}
                      height={80}
                    />
                  )}
                </AvatarImage>
                <AvatarFallback className="text-xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="outline"
                className="w-fit min-w-0 shrink rounded-full"
                onClick={() => router.push('/settings')}
              >
                <Settings />
                Settings
              </Button>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold">{fullName}</span>
              <span className="text-muted-foreground text-sm">
                {userProfile.username}
              </span>
            </div>

            <span className="text-sm">{userProfile.bio}</span>

            <div className="flex gap-4">
              <Link
                href="/following"
                className="text-sm hover:underline focus:underline focus:outline-none"
              >
                <span className="font-semibold">{followingCount}</span>{' '}
                <span className="text-muted-foreground">Following</span>
              </Link>
              <Link
                href="/follower"
                className="text-sm hover:underline focus:underline focus:outline-none"
              >
                <span className="font-semibold">{followersCount}</span>{' '}
                <span className="text-gray-600">Followers</span>
              </Link>
            </div>
          </div>

          <div className="divide-border divide-y divide-solid">
            {mockPosts.map((_, index) => (
              <PostItem key={index} />
            ))}
          </div>
        </div>
      </main>
      <NavigationBar />
    </>
  );
}
