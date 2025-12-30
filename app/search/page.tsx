'use client';

import { Suspense, useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';

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
import api from '@/lib/axios';

function SearchContent() {
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const f = searchParams.get('f') || 'top';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Store filter type with results to prevent rendering mismatch
  const [dataState, setDataState] = useState<{ filter: string; results: any[] }>({
    filter: f,
    results: []
  });

  const [loading, setLoading] = useState(false);

  // Cache stores: results and scroll position for each tab (f)
  const cacheRef = useRef<{
    [key: string]: {
      results: any[];
      scroll: number;
    }
  }>({});

  const currentQueryRef = useRef(initialQuery);

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Clear cache if query changes
  useEffect(() => {
    if (debouncedQuery !== currentQueryRef.current) {
      console.log('Query changed, clearing cache');
      cacheRef.current = {};
      currentQueryRef.current = debouncedQuery;
    }
  }, [debouncedQuery]);

  // Save Scroll on clicking a new tab
  // This is more reliable than doing it in effect during transition
  const handleTabClick = () => {
    // Save current scroll to current filter cache
    const scrollY = window.scrollY;
    if (!cacheRef.current[f]) {
      // If for some reason cache is missing, create it with current results if they match
      if (dataState.filter === f) {
        cacheRef.current[f] = { results: dataState.results, scroll: scrollY };
      }
    } else {
      cacheRef.current[f].scroll = scrollY;
    }
  };

  // Fetch logic
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedQuery) {
        setDataState({ filter: f, results: [] });
        return;
      }

      setLoading(true);

      // Check cache
      if (cacheRef.current[f]) {
        // If we have cache, use it
        setDataState({ filter: f, results: cacheRef.current[f].results });
        // Restore scroll immediately after setting state? 
        // We can try here, but effect below handles it safer after render.
        setLoading(false);
        return;
      }

      try {
        let data: any[] = [];
        const encodedQ = encodeURIComponent(debouncedQuery);

        let res;
        if (f === 'top') {
          res = await api.get(`/posts/search?search=${encodedQ}&sort=top`);
        } else if (f === 'latest') {
          res = await api.get(`/posts/search?search=${encodedQ}&sort=latest`);
        } else if (f === 'media') {
          res = await api.get(`/posts/search?search=${encodedQ}&type=media`);
        } else if (f === 'people') {
          res = await api.get(`/users?search=${encodedQ}`);
        } else if (f === 'places') {
          res = await api.get(`/locations?search=${encodedQ}`);
        }

        if (res && res.data) {
          data = res.data.data;
        }

        setDataState({ filter: f, results: data });
        // Save to cache
        cacheRef.current[f] = { results: data, scroll: 0 };
      } catch (error) {
        console.error(error);
        setDataState({ filter: f, results: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery, f]);

  // Restore Scroll
  // We use useLayoutEffect to restore scroll as early as possible after render
  useLayoutEffect(() => {
    if (!loading && cacheRef.current[f] && dataState.filter === f) {
      const savedScroll = cacheRef.current[f].scroll;
      // Only scroll if we are not already there (though usually we are at 0 after nav if automated, but we disabled it)
      // Actually with scroll={false}, we might still be at old scroll position?
      // Yes! So we MUST scroll to saved position (which might be 0 for new tabs, or saved value for visited tabs).
      window.scrollTo(0, savedScroll);
    } else if (loading) {
      // If loading, maybe scroll to top? Or keep previous?
      // Usually safer to scroll to top or keep. 
      // Let's scroll to top if it's a fresh fetch?
      // If it's a fresh fetch (not in cache), we set scroll: 0 in cache logic above.
      // But here we might not hit the if block.
      if (!cacheRef.current[f]) {
        window.scrollTo(0, 0);
      }
    }
  }, [f, dataState, loading]);

  const tabs = [
    { name: 'Top', value: 'top' },
    { name: 'Latest', value: 'latest' },
    { name: 'Media', value: 'media' },
    { name: 'People', value: 'people' },
    { name: 'Places', value: 'places' },
  ];

  const isDataReady = dataState.filter === f;
  const displayResults = isDataReady ? dataState.results : [];

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

        {debouncedQuery !== '' && (
          <div className="no-scrollbar relative flex w-full overflow-x-scroll text-center">
            {tabs.map((tab) => (
              <Link
                key={tab.value}
                href={`?q=${encodeURIComponent(query)}&f=${tab.value}`}
                replace
                scroll={false}
                onClick={handleTabClick}
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
      {debouncedQuery === '' && (
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
      {debouncedQuery !== '' && (
        <main className="xs:pb-[78px] flex items-center justify-center pb-[81px]">
          <div className="divide-border flex w-full max-w-xl flex-col divide-y divide-solid">
            {loading || !isDataReady ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : displayResults.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No results found.</div>
            ) : (
              <>
                {displayResults.map((item: any) => {
                  if (f === 'people') {
                    return <AccountItem key={item.id} user={item} />;
                  } else if (f === 'places') {
                    return <PlaceItem key={item.id} location={item} />;
                  } else {
                    // posts
                    return <PostItem key={item.id} post={item} />;
                  }
                })}
              </>
            )}
          </div>
        </main>
      )}
      <NavigationBar />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
