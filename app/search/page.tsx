'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Search } from 'lucide-react';

import AccountItem from '@/components/AccountItem';
import NavigationBar from '@/components/NavigationBar';
import PlaceItem from '@/components/PlaceItem';
import PostItem from '@/components/PostItem';
import TopBar from '@/components/TopBar';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

export default function SearchPage() {
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const f = searchParams.get('f') || 'top';

  const [query, setQuery] = useState(initialQuery);

  const tabs = [
    { name: 'Top', value: 'top' },
    { name: 'Latest', value: 'latest' },
    { name: 'Media', value: 'media' },
    { name: 'People', value: 'people' },
    { name: 'Places', value: 'places' },
  ];

  return (
    <>
      <TopBar className="flex w-full flex-col items-center px-4 pt-4">
        <label htmlFor="search" className="sr-only hidden">
          Search
        </label>
        <div className="mb-4 w-full max-w-sm">
          <InputGroup className="shadow-none">
            <InputGroupAddon>
              <Search size={16} />
            </InputGroupAddon>
            <InputGroupInput
              id="search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </InputGroup>
        </div>

        {query !== '' && (
          <div className="no-scrollbar relative flex w-full overflow-x-scroll text-center">
            {tabs.map((tab) => (
              <Link
                key={tab.value}
                href={`?q=${encodeURIComponent(query)}&f=${tab.value}`}
                className="hover:bg-accent focus-visible:bg-accent focus:inset-ring-ring/50 relative flex-1 py-4 text-center transition-colors focus:outline-none focus-visible:inset-ring-2"
              >
                <span
                  className={`px-4 transition-colors ${f === tab.value ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                >
                  {tab.name}
                </span>
                {f === tab.value && (
                  <div className="bg-primary absolute bottom-0 h-1 w-full rounded-full" />
                )}
              </Link>
            ))}
          </div>
        )}
      </TopBar>
      {query === '' && (
        <div className="flex h-[calc(100dvh-150px)] w-lvw items-center justify-center">
          <div className="flex max-w-sm flex-col items-center gap-2 p-8 text-center">
            <div className="bg-muted text-foreground mb-2 flex size-10 items-center justify-center rounded-lg">
              <Search size={24} />
            </div>
            <span className="text-lg font-medium tracking-tight">
              Start Searching
            </span>
            <span className="text-muted-foreground">
              Enter keywords in the search field above to find the results.
            </span>
          </div>
        </div>
      )}
      {query !== '' && (
        <main className="xs:pb-[78px] flex items-center justify-center pb-[81px]">
          <div className="divide-border flex max-w-xl flex-col divide-y divide-solid">
            <AccountItem />
            <AccountItem />
            <PlaceItem />
            <PlaceItem />
            <PostItem />
            <PostItem />
          </div>
        </main>
      )}
      <NavigationBar />
    </>
  );
}
