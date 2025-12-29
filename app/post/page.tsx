'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SendHorizontalIcon, Star, X } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

import NavigationBar from '@/components/NavigationBar';
import PostAction from '@/components/PostAction';
import TopBar from '@/components/TopBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Textarea } from '@/components/ui/textarea';

function PostDetail() {
  const router = useRouter();

  const stopPropagation = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on('select', updateCurrent);

    return () => {
      api.off('select', updateCurrent);
    };
  }, [api]);

  const images: string[] = [
    '/picsum_random_1.jpg',
    '/picsum_random_2.jpg',
    '/picsum_random_3.jpg',
    '/picsum_random_4.jpg',
  ];

  const imagesCount = images.length;

  const getGridClass = (index: number) => {
    if (imagesCount === 1) {
      return 'col-span-2 row-span-2';
    }

    if (imagesCount === 2) {
      return 'col-span-1 row-span-2';
    }

    if (imagesCount === 3) {
      if (index === 0) return 'col-span-1 row-span-2';

      return 'col-span-1 row-span-1';
    }

    if (imagesCount === 4) {
      return 'col-span-1 row-span-1';
    }

    return '';
  };

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const openModalAndStopPropagation = (
    e: React.MouseEvent<HTMLButtonElement>,
    i: number
  ) => {
    e.stopPropagation();
    setSelectedIndex(i);
    setCurrent(i + 1);
    setOpen(true);
  };

  const closeModalAndStopPropagation = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const mockPostData = {
    likes: 62,
    isLiked: liked,
    replies: 1283,
  };

  return (
    <article
      className="has-[button:focus-visible]:bg-accent/40 has-[a:focus-visible]:bg-accent/40 flex w-full flex-col gap-4 px-4 py-6 transition-colors"
      tabIndex={0}
      onClick={() => router.push('/post')}
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarImage asChild src="https://github.com/shadcn.png">
            <Link
              href="/profile"
              onClick={stopPropagation}
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
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>

        <div className="flex w-full max-w-[calc(100%-48px)] flex-col gap-1">
          <div className="flex w-full gap-1">
            <div className="flex w-full min-w-0 flex-1 gap-1">
              <Link
                href="/profile"
                onClick={stopPropagation}
                className="truncate text-sm font-semibold hover:underline focus:underline focus:outline-none"
              >
                John Doe
              </Link>
              <span className="text-muted-foreground flex-1 truncate text-sm">
                @johndoe
              </span>
            </div>
          </div>

          <Link
            href="/place"
            onClick={stopPropagation}
            className="w-fit text-sm hover:underline focus:underline focus:outline-none"
          >
            Kebun Raya Bogor
          </Link>
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} className="fill-yellow-300 text-yellow-300" />
        ))}
      </div>

      <span className="text-sm">Lorem ipsum dolor sit amet consectur</span>

      <div className="has-[button:focus-visible]:ring-ring/50 grid aspect-[16/9] grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-xl transition-colors select-none has-[button:focus-visible]:ring-2">
        {images.map((src, i) => (
          <button
            key={i}
            className={`cursor-pointer transition-[filter] hover:brightness-80 focus-visible:brightness-80 ${getGridClass(i)}`}
            onClick={(e) =>
              openModalAndStopPropagation(
                e as React.MouseEvent<HTMLButtonElement>,
                i
              )
            }
          >
            <Image
              src={src}
              alt={`Image ${i + 1}`}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-black/90"
          onClick={stopPropagation}
        >
          <button
            className="text-primary-foreground absolute top-4 right-4"
            onClick={closeModalAndStopPropagation}
          >
            <X size={24} />
          </button>

          <Carousel
            setApi={setApi}
            className="max-w-xl"
            opts={{ startIndex: selectedIndex }}
          >
            <CarouselContent className="items-center">
              {images.map((src, i) => (
                <CarouselItem key={i}>
                  <Image
                    src={src}
                    alt={`Image ${i}`}
                    width={800}
                    height={800}
                    className="object-contain select-none"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="text-primary-foreground pointer-events-none fixed top-4 left-0 flex w-dvw justify-center text-sm">
            Image {current} of {imagesCount}
          </div>
        </div>
      )}

      <span className="text-muted-foreground text-sm">14:30 · 11 Des 2025</span>

      <div className="border-t-border border-t border-solid pt-4">
        <PostAction
          initialLikes={mockPostData.likes}
          initialIsLiked={mockPostData.isLiked}
          repliesCount={mockPostData.replies}
          stopPropagation={stopPropagation}
        />
      </div>
    </article>
  );
}

function CommentInput() {
  const [commentText, setCommentText] = useState('');

  const isButtonDisabled = commentText.trim().length === 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    console.log('Komentar dikirim:', commentText);

    setCommentText('');
  };

  return (
    <div className="flex w-full gap-3 px-4 py-6">
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
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="relative">
          <Textarea
            placeholder="Post your reply"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[60px] pr-9"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:bg-accent focus-visible:ring-ring/50 absolute right-0 bottom-0 mx-2 my-1 rounded-lg"
            type="submit"
            disabled={isButtonDisabled}
          >
            <SendHorizontalIcon />
            <span className="sr-only">Post your reply</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

interface Comment {
  id: string;
  user: {
    name: string;
    handle: string;
    avatarUrl: string;
    profileLink: string;
  };
  content: string;
  timeAgo: string;
  likes: number;
  replies: number;
  isLiked: boolean;
}

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  const router = useRouter();

  const handlePostClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    router.push('/post');
  };

  const stopPropagation = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const initialLikes = comment.likes;
  const initialIsLiked = comment.isLiked;
  const repliesCount = comment.replies;

  return (
    <div
      className="hover:bg-accent/40 has-[a:focus-visible]:bg-accent/40 has-[button:focus-visible]:bg-accent/40 focus-visible:bg-accent/40 focus:inset-ring-ring/50 flex w-full flex-col gap-3 px-4 py-6 transition-colors focus:outline-none focus-visible:inset-ring-2"
      onClick={handlePostClick}
      tabIndex={0}
    >
      <div className="flex gap-3">
        <Avatar className="size-9">
          <AvatarImage asChild src={comment.user.avatarUrl}>
            <Link
              href="/profile"
              className="transition-[filter] select-none hover:brightness-80 focus:brightness-80"
              onClick={stopPropagation}
            >
              <Image
                src={comment.user.avatarUrl}
                alt={`Go to ${comment.user.name}'s profile page`}
                width={36}
                height={36}
              />
            </Link>
          </AvatarImage>
          <AvatarFallback>
            {comment.user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-grow flex-col gap-1">
          <div className="flex gap-1">
            <Link
              href="/profile"
              className="flex hover:underline focus:underline focus:outline-none"
              onClick={stopPropagation}
            >
              <span className="text-sm leading-tight font-semibold">
                {comment.user.name}
              </span>
            </Link>
            <span className="text-muted-foreground text-sm leading-tight">
              @{comment.user.handle}
            </span>
          </div>

          <span className="text-left text-sm">{comment.content}</span>
        </div>

        <span className="text-muted-foreground text-sm">{comment.timeAgo}</span>
      </div>

      <PostAction
        initialLikes={initialLikes}
        initialIsLiked={initialIsLiked}
        repliesCount={repliesCount}
        stopPropagation={stopPropagation}
      />
    </div>
  );
}

const mockComments: Comment[] = [
  {
    id: 'c1',
    user: {
      name: 'Jane Doe',
      handle: 'janedoe_dev',
      avatarUrl: 'https://github.com/shadcn.png',
      profileLink: '/profile/janedoe_dev',
    },
    content:
      'Setuju banget! Optimasi kinerja React seringkali diabaikan di awal proyek, padahal dampaknya besar. Hooks seperti `useMemo` dan `useCallback` adalah penyelamat!',
    timeAgo: '5m',
    likes: 125,
    replies: 15,
    isLiked: false,
  },
  {
    id: 'c2',
    user: {
      name: 'Alex Smith',
      handle: 'alex_frontend',
      avatarUrl: 'https://github.com/shadcn.png',
      profileLink: '/profile/alex_frontend',
    },
    content:
      'Tortor posuere ac ut consequat semper viverra nam libero justo, laoreet sit amet cursus sit amet, dictum sit amet justo. Ini contoh implementasi yang bagus.',
    timeAgo: '23s',
    likes: 63,
    replies: 1283,
    isLiked: true,
  },
  {
    id: 'c3',
    user: {
      name: 'Budi Utama',
      handle: 'budi_code',
      avatarUrl: 'https://github.com/shadcn.png',
      profileLink: '/profile/budi_code',
    },
    content:
      'Ada yang punya rekomendasi library untuk *virtualized list* di Next.js? Pengalaman saya dengan proyek besar sangat terbantu dengan itu.',
    timeAgo: '1h',
    likes: 42,
    replies: 5,
    isLiked: false,
  },
];

export default function PostPage() {
  const router = useRouter();

  return (
    <>
      <TopBar className="flex w-full items-center gap-3 p-4 text-xl font-semibold">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back to previous page"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </Button>
        Post
      </TopBar>

      <main className="xs:pb-[78px] flex items-center justify-center pb-[81px]">
        <div className="divide-border flex max-w-xl flex-col divide-y divide-solid">
          <PostDetail />
          <CommentInput />
          {mockComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </main>
      <NavigationBar />
    </>
  );
}
