'use client';

import React from 'react';
import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import NavigationBar from '@/components/NavigationBar';
import TopBar from '@/components/TopBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Notification {
  type: 'like' | 'follow' | 'comment';
  fullName: string;
  userInitials: string;
  actionText: string;
  avatarUrl: string;
  time: string;
  commentText?: string;

  postContent?: {
    place: string;
    rating: number;
  };
}

const truncateByLetter = (text: string): string => {
  if (!text) {
    return '';
  }

  const MAX_LENGTH: number = 20;

  if (text.length > MAX_LENGTH) {
    return text.substring(0, MAX_LENGTH) + '...';
  }

  return text;
};

const notificationsData: Notification[] = [
  {
    type: 'like',
    fullName:
      ' Sit amet est placerat in egestas erat. Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus et malesuada',
    userInitials: 'AF',
    actionText: 'liked your post',
    avatarUrl: '/avatars/anya.png',
    time: '2 hours ago',
    postContent: {
      place: 'Loid Park',
      rating: 5,
    },
  },
  {
    type: 'follow',
    fullName: 'Loid Spy',
    userInitials: 'LS',
    actionText: 'started following you',
    avatarUrl: 'https://github.com/shadcn.png',
    time: '4 hours ago',
  },
  {
    type: 'comment',
    fullName: 'Yor Briar',
    userInitials: 'YB',
    actionText: 'commented on your post',
    avatarUrl: '',
    time: '1 day ago',
    commentText:
      'At erat pellentesque adipiscing commodo elit, at. Justo donec enim diam, vulputate ut pharetra sit amet, aliquam id diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean?',
    postContent: {
      place: 'Twilight Ramen Stand',
      rating: 4,
    },
  },
  {
    type: 'like',
    fullName: 'Damian Desmond',
    userInitials: 'DD',
    actionText: 'liked your post',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-dfa52352e132?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww',
    time: '5 days ago',
    postContent: {
      place:
        'Iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Risus commodo viverra maecenas accumsan, lacus vel!',
      rating: 3,
    },
  },
];

interface NotificationItemProps {
  notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const {
    type,
    fullName,
    userInitials,
    actionText,
    avatarUrl,
    time,
    commentText,
    postContent,
  } = notification;

  const router = useRouter();

  const stopPropagation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  const destinationPath = type === 'follow' ? '/profile' : '/post';

  const handleNotificationClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    router.push(destinationPath);
  };

  const handleFollowClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsFollowing((prev) => !prev);
  };

  return (
    <div
      className="has-[a:focus-visible]:bg-accent/40 hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:ring-ring/50 flex w-full cursor-pointer flex-col gap-6 px-4 py-6 transition-colors focus:outline-none focus-visible:ring-2"
      tabIndex={0}
      onClick={handleNotificationClick}
    >
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          onClick={stopPropagation}
          className="transition-[filter] select-none hover:brightness-80 focus:brightness-80 focus:outline-none"
        >
          <Avatar className="size-9">
            <AvatarImage asChild src={avatarUrl}>
              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  alt="Go to profile"
                  width={36}
                  height={36}
                />
              )}
            </AvatarImage>
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm">
            <Link
              href="/profile"
              onClick={stopPropagation}
              className="mr-1 font-semibold hover:underline focus:underline focus:outline-none"
            >
              {truncateByLetter(fullName)}
            </Link>
            {actionText} {time}
          </span>

          {type === 'comment' && commentText && (
            <span className="text-foreground line-clamp-2 text-sm italic">
              {commentText}
            </span>
          )}
        </div>
        {type === 'follow' && (
          <Button
            onClick={handleFollowClick}
            variant={isFollowing ? 'outline' : 'default'}
            className="w-fit flex-shrink-0 cursor-pointer rounded-full text-sm font-semibold"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </div>
      {postContent && type !== 'follow' && (
        <div className="flex flex-1 justify-end">
          <Link
            href="/place"
            onClick={stopPropagation}
            className="text-muted-foreground text-right text-sm font-semibold hover:underline focus:underline focus:outline-none"
          >
            {truncateByLetter(postContent.place)}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <>
      <TopBar className="w-full p-4 py-5 text-xl font-semibold tracking-tight">
        Notifications
      </TopBar>
      <main className="xs:pb-[78px] flex flex-col items-center pb-[81px]">
        <div className="divide-border w-full max-w-xl divide-y divide-solid">
          {notificationsData.map((notification, index) => (
            <NotificationItem key={`a-${index}`} notification={notification} />
          ))}
          {notificationsData.map((notification, index) => (
            <NotificationItem key={`b-${index}`} notification={notification} />
          ))}
          {notificationsData.map((notification, index) => (
            <NotificationItem key={`c-${index}`} notification={notification} />
          ))}
        </div>
      </main>
      <NavigationBar />
    </>
  );
}
