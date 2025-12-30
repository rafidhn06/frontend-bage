'use client';

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';

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
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/axios';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

function SearchContent() {
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const f = searchParams.get('f') || 'top';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const [dataState, setDataState] = useState<{
    filter: string;
    results: any[];
    hasMore: boolean;
    page: number;
  }>({
    filter: f,
    results: [],
    hasMore: true,
    page: 1,
  });

  const [loading, setLoading] = useState(!!initialQuery);
  const [loadingMore, setLoadingMore] = useState(false);

  const cacheRef = useRef<{
    [key: string]: {
      results: any[];
      scroll: number;
      hasMore: boolean;
      page: number;
    };
  }>({});

  const currentQueryRef = useRef(initialQuery);

  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.5 });

  useEffect(() => {
    if (isIntersecting && dataState.hasMore && !loading && !loadingMore && dataState.filter === f) {
      fetchData(dataState.page + 1, true);
    }
  }, [isIntersecting, dataState.hasMore, loading, loadingMore, dataState.filter, f]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery !== currentQueryRef.current) {
      cacheRef.current = {};
      currentQueryRef.current = debouncedQuery;
    }
  }, [debouncedQuery]);

  const prevFRef = useRef(f);

  const handleTabClick = () => {
    const scrollY = window.scrollY;
    if (!cacheRef.current[f]) {
      if (dataState.filter === f) {
        cacheRef.current[f] = {
          results: dataState.results,
          scroll: scrollY,
          hasMore: dataState.hasMore,
          page: dataState.page
        };
      }
    } else {
      cacheRef.current[f].scroll = scrollY;
    }
  };

  const fetchData = async (currentPage: number = 1, append: boolean = false) => {
    if (!debouncedQuery) {
      setDataState({ filter: f, results: [], hasMore: false, page: 1 });
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    if (!append && cacheRef.current[f]) {
      const cached = cacheRef.current[f];
      setDataState({
        filter: f,
        results: cached.results,
        hasMore: cached.hasMore,
        page: cached.page
      });
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    try {
      let data: any[] = [];
      const encodedQ = encodeURIComponent(debouncedQuery);
      const pageParam = `&page=${currentPage}`;

      let res;
      if (f === 'top') {
        res = await api.get(`/posts/search?search=${encodedQ}&sort=top${pageParam}`);
      } else if (f === 'latest') {
        res = await api.get(`/posts/search?search=${encodedQ}&sort=latest${pageParam}`);
      } else if (f === 'media') {
        res = await api.get(`/posts/search?search=${encodedQ}&type=media${pageParam}`);
      } else if (f === 'people') {
        res = await api.get(`/users?search=${encodedQ}${pageParam}`);
      } else if (f === 'places') {
        res = await api.get(`/locations?search=${encodedQ}${pageParam}`);
      }

      let hasMorePages = false;

      if (res && res.data) {
        data = res.data.data;
        const meta = res.data.meta;
        hasMorePages = meta ? meta.current_page < meta.last_page : false;
      }

      setDataState(prev => {
        // If filter changed during fetch, ignore result (safety check)
        // But we are in useEffect closure, 'f' is closed over.
        // Best to just use consistent state.
        const finalResults = append ? [...prev.results, ...data] : data;

        cacheRef.current[f] = {
          results: finalResults,
          scroll: append ? window.scrollY : 0,
          hasMore: hasMorePages,
          page: currentPage
        };

        return {
          filter: f,
          results: finalResults,
          hasMore: hasMorePages,
          page: currentPage
        };
      });

    } catch (error) {
      console.error(error);
      if (!append) {
        setDataState({ filter: f, results: [], hasMore: false, page: 1 });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // Reset state on tab change/query change handled by internal logic?
    // fetchData handles cache check.
    fetchData(1, false);
  }, [debouncedQuery, f]);

  useLayoutEffect(() => {
    if (!loading && cacheRef.current[f] && dataState.filter === f) {
      const savedScroll = cacheRef.current[f].scroll;
      window.scrollTo(0, savedScroll);
    } else if (loading) {
      if (!cacheRef.current[f]) {
        window.scrollTo(0, 0);
      }
    }
  }, [f, dataState, loading]);

  const tabs = [
    { name: 'Populer', value: 'top' },
    { name: 'Terbaru', value: 'latest' },
    { name: 'Media', value: 'media' },
    { name: 'Orang', value: 'people' },
    { name: 'Tempat', value: 'places' },
  ];

  const isDataReady = dataState.filter === f;
  const displayResults = isDataReady ? dataState.results : [];

  return (
    <>
      <TopBar className="flex w-full flex-col items-center px-4 pt-4">
        <label htmlFor="search" className="sr-only hidden">
          Cari
        </label>
        <div className="mb-4 w-full max-w-sm">
          <InputGroup className="shadow-none">
            <InputGroupAddon>
              <Search size={16} />
            </InputGroupAddon>
            <InputGroupInput
              id="search"
              placeholder="Cari"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </InputGroup>
        </div>

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
      </TopBar>
      {debouncedQuery === '' && (
        <div className="flex h-[calc(100dvh-250px)] w-lvw items-center justify-center">
          <div className="flex max-w-sm flex-col items-center gap-2 p-8 text-center">
            <div className="bg-muted text-foreground mb-2 flex size-10 items-center justify-center rounded-lg">
              <Search size={24} />
            </div>
            <span className="text-lg font-medium tracking-tight">
              Mulai Mencari
            </span>
            <span className="text-muted-foreground">
              Masukkan kata kunci di kolom pencarian di atas untuk menemukan
              hasil.
            </span>
          </div>
        </div>
      )}
      {debouncedQuery !== '' && (
        <main className="xs:pb-[78px] flex items-center justify-center pb-[81px]">
          <div className="divide-border flex w-full max-w-xl flex-col divide-y divide-solid">
            {loading || !isDataReady ? (
              <div className="flex h-[calc(100dvh-250px)] w-full items-center justify-center">
                <Spinner className="size-8" />
              </div>
            ) : displayResults.length === 0 ? (
              <span className="text-muted-foreground flex h-[calc(100dvh-250px)] w-full items-center justify-center">
                Tidak ada hasil ditemukan
              </span>
            ) : (
              <>
                {displayResults.map((item: any) => {
                  if (f === 'people') {
                    return <AccountItem key={item.id} user={item} />;
                  } else if (f === 'places') {
                    return <PlaceItem key={item.id} location={item} />;
                  } else {
                    return <PostItem key={item.id} post={item} />;
                  }
                })}

                {dataState.hasMore && (
                  <div ref={ref} className="flex justify-center p-4">
                    {loadingMore && <Spinner className="size-6" />}
                  </div>
                )}
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
    <Suspense fallback={<div>Memuat...</div>}>
      <SearchContent />
    </Suspense>
  );
}
