'use client';

import { useRef, useEffect, useState } from 'react';

// import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { toast } from 'sonner';

// import { useSearchParams } from 'next/navigation';

// export const metadata: Metadata = {
//   title: 'Feed',
// };

import NavigationBar from '@/components/NavigationBar';
import PostItem from '@/components/PostItem';
import TopBar from '@/components/TopBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/axios';
import { Post, User } from '@/types';

// Cache to persist data across navigation but reset on reload
const feedCache: Record<string, { posts: Post[]; page: number; hasMore: boolean }> = {};

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export default function FeedPage() {
  const [selectedOption, setSelectedOption] = useState('Saran');
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [isIntersecting, hasMore, loading]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user');
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        toast.error('Gagal memuat profil pengguna. Silahkan coba lagi nanti.');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const savedTab = sessionStorage.getItem('feed_tab');
    if (savedTab && savedTab !== selectedOption) {
      setSelectedOption(savedTab);
    }
  }, []);

  useEffect(() => {
    if (selectedOption) {
      sessionStorage.setItem('feed_tab', selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (!loading && posts.length > 0) {
      const savedPosition = sessionStorage.getItem(
        `scroll_position_${selectedOption}`
      );
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    }
  }, [selectedOption]);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(
        `scroll_position_${selectedOption}`,
        window.scrollY.toString()
      );
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedOption]);

  const fetchPosts = async (currentPage: number, isLoadMore: boolean = false) => {
    const type = selectedOption === 'Saran' ? 'fyp' : 'following';

    // If not loading more (initial load), check cache
    if (!isLoadMore) {
      if (feedCache[type]) {
        setPosts(feedCache[type].posts);
        setPage(feedCache[type].page);
        setHasMore(feedCache[type].hasMore);
        setLoading(false);
        return;
      }
    }

    setLoading(true);

    try {
      const response = await api.get(`/feed?type=${type}&page=${currentPage}`);
      const newPosts = response.data.data;
      const meta = response.data.meta;

      setPosts((prev) => {
        const updatedPosts = isLoadMore ? [...prev, ...newPosts] : newPosts;

        // Update cache
        feedCache[type] = {
          posts: updatedPosts,
          page: currentPage,
          hasMore: meta.current_page < meta.last_page
        };

        return updatedPosts;
      });

      setHasMore(meta.current_page < meta.last_page);

    } catch (error) {
      toast.error('Gagal memuat unggahan. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, false);
  }, [selectedOption]);

  // Load more trigger
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page, true);
    }
  }, [page]);

  return (
    <>
      <TopBar className="flex w-full items-center gap-4 p-4">
        <div className="flex flex-1">
          <Select
            value={selectedOption}
            onValueChange={(value) => {
              setSelectedOption(value);
            }}
          >
            <SelectTrigger className="hover:bg-accent w-29 cursor-pointer shadow-none transition-[box-shadow]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              align="start"
              onCloseAutoFocus={(event) => {
                event.preventDefault();
              }}
            >
              <SelectItem value="Saran">Saran</SelectItem>
              <SelectItem value="Mengikuti">Mengikuti</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Image
          src="/icon.svg"
          alt="Ikon aplikasi Bage"
          width={16}
          height={24}
          className="select-none"
        />

        <div className="flex flex-1 justify-end">
          {user && (
            <Avatar className="size-9">
              <AvatarImage asChild src={user.profile_picture_url || undefined}>
                <Link
                  href={`/profile/${user.username}`}
                  className="transition-[filter] select-none hover:brightness-80 focus:brightness-80"
                >
                  <Image
                    src={user.profile_picture_url || ''}
                    alt="Kunjungi halaman profil"
                    width={36}
                    height={36}
                    unoptimized
                  />
                </Link>
              </AvatarImage>
              <AvatarFallback>
                {user.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </TopBar>

      <main className="xs:pb-[78px] flex items-center justify-center divide-y divide-solid pb-[81px]">
        <div className="divide-border flex w-full max-w-xl flex-col divide-y divide-solid">
          {posts.map((post) => <PostItem key={post.id} post={post} />)}

          {loading && (
            <div className="flex w-full items-center justify-center p-4">
              <Spinner className="size-8" />
            </div>
          )}

          {!loading && hasMore && (
            <div ref={ref} className="h-4 w-full" />
          )}

          {!loading && posts.length === 0 && (
            <div className="text-muted-foreground flex h-[calc(100dvh-150px)] w-full items-center justify-center">
              Belum ada unggahan
            </div>
          )}
        </div>
      </main>

      <NavigationBar />
    </>
  );
}
