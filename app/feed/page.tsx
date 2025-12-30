'use client';

import { useEffect, useState } from 'react';

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

export default function FeedPage() {
  const [selectedOption, setSelectedOption] = useState('Saran');
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && posts.length > 0) {
      const savedPosition = sessionStorage.getItem(
        `scroll_position_${selectedOption}`
      );
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [loading, posts, selectedOption]);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(
        `scroll_position_${selectedOption}`,
        window.scrollY.toString()
      );
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedOption]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const type = selectedOption === 'Saran' ? 'fyp' : 'following';
      const response = await api.get(`/feed?type=${type}`);
      setPosts(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat unggahan. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedOption]);

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
            <SelectTrigger className="hover:bg-accent w-28 cursor-pointer shadow-none transition-[box-shadow]">
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
              <AvatarImage asChild src={user.profile_picture || undefined}>
                <Link
                  href={`/profile/${user.username}`}
                  className="transition-[filter] select-none hover:brightness-80 focus:brightness-80"
                >
                  <Image
                    src={user.profile_picture || ''}
                    alt="Kunjungi halaman profil"
                    width={36}
                    height={36}
                    unoptimized
                  />
                </Link>
              </AvatarImage>
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </TopBar>

      <main className="xs:pb-[78px] flex items-center justify-center divide-y divide-solid pb-[81px]">
        <div className="divide-border flex w-full max-w-xl flex-col divide-y divide-solid">
          {loading ? (
            <div className="flex h-[calc(100dvh-150px)] w-full items-center justify-center">
              <Spinner className="size-8" />
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostItem key={post.id} post={post} />)
          ) : (
            <div className="text-muted-foreground flex h-[calc(100dvh-150px)] w-full items-center justify-center">
              Tidak ada postingan ditemukan
            </div>
          )}
        </div>
      </main>

      <NavigationBar />
    </>
  );
}
