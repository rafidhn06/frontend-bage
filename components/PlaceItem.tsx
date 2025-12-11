import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronRight } from 'lucide-react';

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
      <div className="flex flex-grow flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Link
            href="/place"
            className="flex hover:underline focus:underline focus:outline-none"
          >
            <span className="text-sm font-semibold">Kebun Raya Bogor</span>
          </Link>
          <span className="text-muted-foreground text-sm">
            Park, Garden, Playground
          </span>
        </div>
        <span className="text-sm">
          Jl. Otto Iskandardinata No.13, Kota Bogor
        </span>
      </div>
      <ChevronRight size={20} />
    </div>
  );
}
