import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronRight, Trees } from 'lucide-react';

export default function PlaceItem() {
  const router = useRouter();

  const handlePlaceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    router.push('/place');
  };

  return (
    <div
      className="hover:bg-accent/40 has-[a:focus-visible]:bg-accent/40 focus-visible:bg-accent/40 focus:inset-ring-ring/50 flex w-full items-center gap-2 px-4 py-6 transition-colors focus:outline-none focus-visible:inset-ring-2"
      onClick={handlePlaceClick}
      tabIndex={0}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <div className="p-2">
          <Trees size={20} className="text-muted-foreground" />
        </div>
        <div className="flex min-w-0 flex-1 flex-grow flex-col gap-1">
          <div className="flex gap-1">
            <Link
              href="/place"
              className="flex min-w-0 hover:underline focus:underline focus:outline-none"
            >
              <span className="truncate text-sm font-semibold">
                Kebun Raya Bogor
              </span>
            </Link>
            <span className="text-muted-foreground flex-1 text-sm">Park</span>
          </div>
          <span className="text-sm">Jl. Otto Iskandar No.13</span>
        </div>
      </div>
      <ChevronRight size={20} className="text-muted-foreground" />
    </div>
  );
}
