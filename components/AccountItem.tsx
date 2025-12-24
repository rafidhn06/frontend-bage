'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export default function AccountItem() {
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();

  const handleFollowClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsFollowing((prev) => !prev);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    router.push('/profile');
  };

  return (
    <div
      className="hover:bg-accent/40 has-[a:focus-visible]:bg-accent/40 has-[button:focus-visible]:bg-accent/40 focus-visible:bg-accent/40 focus:inset-ring-ring/50 flex w-full gap-3 px-4 py-6 transition-colors focus:outline-none focus-visible:inset-ring-2"
      onClick={handleProfileClick}
      tabIndex={0}
    >
      <Avatar className="size-9">
        <AvatarImage asChild src="https://github.com/shadcn.png">
          <Link
            href="/profile"
            className="transition-[filter] select-none hover:brightness-80 focus:brightness-80"
          >
            <Image
              src="https://github.com/shadcn.png"
              alt="Go to profile page"
              width={36}
              height={36}
            />
          </Link>
        </AvatarImage>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-grow flex-col gap-1">
        <div className="flex gap-1">
          <Link
            href="/profile"
            className="flex min-w-0 hover:underline focus:underline focus:outline-none"
          >
            <span className="truncate text-sm leading-tight font-semibold">
              John Doe
            </span>
          </Link>
          <span className="text-muted-foreground flex-1 truncate text-sm leading-tight">
            @johndoe
          </span>
        </div>
        <span className="text-sm">
          Tortor posuere ac ut consequat semper viverra nam libero justo,
          laoreet sit amet cursus sit amet, dictum sit amet justo.
        </span>
      </div>

      <Button
        onClick={handleFollowClick}
        variant={isFollowing ? 'outline' : 'default'}
        className="w-fit flex-shrink-0 cursor-pointer rounded-full text-sm font-semibold shadow-none"
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  );
}
