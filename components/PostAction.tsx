'use client';

import { useState } from 'react';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Ellipsis, Heart, MessageCircle } from 'lucide-react';
import { Copy, Trash, UserPlus } from 'lucide-react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { useMediaQuery } from '@/hooks/use-media-query';

interface PostActionProps {
  initialLikes: number;
  initialIsLiked: boolean;
  repliesCount: number;
  stopPropagation: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function PostAction({
  initialLikes,
  initialIsLiked,
  repliesCount,
  stopPropagation,
}: PostActionProps) {
  const [liked, setLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLiked((prevLiked) => {
      setLikeCount((prevCount) => prevCount + (prevLiked ? -1 : 1));
      return !prevLiked;
    });
  };

  const isXs = useMediaQuery('(max-width: 30rem)');
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formattedReplies =
    repliesCount > 1000 ? `${(repliesCount / 1000).toFixed(1)}k` : repliesCount;

  return (
    <div className="flex px-3 pt-2">
      <div className="flex flex-1 items-center gap-1">
        <button
          aria-label="Like post"
          onClick={handleLikeClick}
          className={`peer text-muted-foreground cursor-pointer rounded-sm p-1 transition hover:bg-red-500/10 hover:text-red-500 focus-visible:bg-red-500/10 focus-visible:text-red-500 focus-visible:ring-3 focus-visible:ring-red-300 focus-visible:outline-none ${
            liked ? 'text-red-500 *:[svg]:fill-red-500' : ''
          }`}
        >
          <Heart size={16} />
        </button>
        <span
          className={`text-sm peer-hover:text-red-500 ${
            liked ? 'text-red-500' : 'text-muted-foreground'
          }`}
        >
          {likeCount}
        </span>
      </div>

      <div className="flex flex-1 items-center gap-1">
        <button
          aria-label="View comments"
          onClick={stopPropagation}
          className="peer text-muted-foreground cursor-pointer rounded-sm p-1 transition hover:bg-blue-500/10 hover:text-blue-500 focus-visible:bg-blue-500/10 focus-visible:text-blue-500 focus-visible:ring-3 focus-visible:ring-blue-300 focus-visible:outline-none"
        >
          <MessageCircle size={16} />
        </button>
        <span className="text-muted-foreground text-sm peer-hover:text-blue-500">
          {formattedReplies}
        </span>
      </div>

      <div className="flex flex-1 justify-end">
        {isXs ? (
          <Drawer>
            <DrawerTrigger asChild>
              <button
                aria-label="More options"
                onClick={stopPropagation}
                className="text-muted-foreground hover:bg-accent focus-visible:bg-accent focus-visible:ring-ring/50 cursor-pointer rounded-sm p-1 transition focus:outline-none focus-visible:ring-3"
              >
                <Ellipsis size={16} />
              </button>
            </DrawerTrigger>

            <DrawerContent className="px-6">
              <DrawerHeader className="hidden">
                <DrawerTitle>
                  <VisuallyHidden>More options</VisuallyHidden>
                </DrawerTitle>
              </DrawerHeader>

              <div className="flex flex-col gap-6 py-6">
                <button
                  className="flex items-center gap-4 text-left font-bold"
                  onClick={stopPropagation}
                >
                  <UserPlus size={16} />
                  Follow user
                </button>
                <button
                  className="flex items-center gap-4 text-left font-bold"
                  onClick={stopPropagation}
                >
                  <Copy size={16} />
                  Copy link
                </button>
                <button
                  className="flex items-center gap-4 text-left font-bold text-red-600"
                  onClick={stopPropagation}
                >
                  <Trash size={16} />
                  Delete post
                </button>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              asChild
              onClick={stopPropagation}
              className="text-muted-foreground hover:bg-accent focus-visible:bg-accent focus-visible:ring-ring/50 cursor-pointer rounded-sm p-1 transition focus:outline-none focus-visible:ring-3"
            >
              <button aria-label="More options">
                <Ellipsis size={16} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 font-bold"
                onClick={stopPropagation}
              >
                <UserPlus size={16} />
                Follow user
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 font-bold"
                onClick={stopPropagation}
              >
                <Copy size={16} />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 font-bold"
                variant="destructive"
                onClick={stopPropagation}
              >
                <Trash size={16} />
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
