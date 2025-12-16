'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft, Star } from 'lucide-react';

import NavigationBar from '@/components/NavigationBar';
import PostItem from '@/components/PostItem';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';

const placeProfile = {
  name: 'Kopi Kenangan Senja',
  address: 'Jl. Pegangsaan Timur No. 123, Jakarta Pusat',
  categories: ['Coffee Shop', 'Working Space', 'Pet Friendly'],
  postCount: 57,
  description:
    'Kopi Kenangan Senja adalah tempat yang ideal untuk menikmati kopi sambil bekerja atau bersantai bersama teman-teman. Dengan suasana yang nyaman dan pemandangan yang asri, kami menyediakan berbagai pilihan kopi dan makanan ringan yang lezat.',
};

const mockPosts = [1, 2, 3];

const averageRating = 4.5;
const totalRatings = 120;

export default function PlaceProfilePage() {
  const { name, address, categories, postCount, description } = placeProfile;

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
          <div className="flex flex-col gap-6 px-4 py-6">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-bold">{name}</span>

              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm italic">
                    {categories.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {description && <span className="text-sm">{description}</span>}

            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-300 text-yellow-300" />
              <span className="text-sm">
                {averageRating.toFixed(1)} ({totalRatings} posts)
              </span>
            </div>

            <span className="text-sm">{address}</span>
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
