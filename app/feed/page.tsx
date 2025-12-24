'use client';

import { useEffect, useState } from 'react';

// import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// export const metadata: Metadata = {
//   title: 'Feed',
// };

import NavigationBar from '@/components/NavigationBar';
import PostItem from '@/components/PostItem';
import PostService from '@/services/PostService';
import TopBar from '@/components/TopBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function FeedPage() {
  const [selectedOption, setSelectedOption] = useState('For you');
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const type = selectedOption === 'Following' ? 'following' : 'fyp'
        const res = await PostService.feed(type as any, 1)
        if (!mounted) return
        // assuming API returns { data: [...], meta }
        setPosts(res.data ?? res ?? [])
      } catch (e: any) {
        setError(e?.message || 'Gagal memuat feed')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [selectedOption])

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
              <SelectItem value="For you">For you</SelectItem>
              <SelectItem value="Following">Following</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Image
          src="/icon.svg"
          alt="Bage app icon"
          width={16}
          height={24}
          className="select-none"
        />

        <div className="flex flex-1 justify-end">
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
        </div>
      </TopBar>

      <main className="xs:pb-[78px] flex items-center justify-center divide-y divide-solid pb-[81px]">
        <div className="divide-border flex max-w-xl flex-col divide-y divide-solid">
          {loading && <div className="p-4 text-center">Memuat feed...</div>}
          {error && <div className="p-4 text-center text-red-500">{error}</div>}
          {!loading && !error && posts.length === 0 && (
            <div className="p-4 text-center">Belum ada unggahan.</div>
          )}
          {!loading && posts.map((p: any) => (
            <PostItem key={p.id} post={p} />
          ))}
        </div>
      </main>

      <NavigationBar />
    </>
  );
}
