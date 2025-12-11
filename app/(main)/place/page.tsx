'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, MapPin, Tag } from 'lucide-react';

import PostItem from '@/components/PostItem';
import TopBar from '@/components/TopBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const placeProfile = {
  name: 'Kopi Kenangan Senja',
  address: 'Jl. Pegangsaan Timur No. 123, Jakarta Pusat',
  categories: ['Coffee Shop', 'Working Space', 'Pet Friendly'],
  postCount: 57,
};

const mockPosts = [1, 2, 3];

export default function PlaceProfilePage() {
  const { name, address, categories, postCount } = placeProfile;

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
          {name}
          <span className="text-muted-foreground block text-sm font-normal">
            {postCount} posts
          </span>
        </div>
      </TopBar>

      <main className="xs:pb-[78px] flex items-center justify-center pb-[81px]">
        <div className="divide-border flex max-w-xl flex-col divide-y divide-solid">
          <div className="flex flex-col gap-8 p-4 py-6">
            <div className="flex flex-col gap-4">
              <span className="text-xl font-bold">{name}</span>

              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Badge variant="secondary" key={index}>
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <span className="text-muted-foreground text-sm">{address}</span>
          </div>

          <div className="divide-border divide-y divide-solid">
            {mockPosts.map((_, index) => (
              <PostItem key={index} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
