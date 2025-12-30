import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronRight, Trees } from 'lucide-react';
import { LocationDetail } from '../types';

interface PlaceItemProps {
  location: LocationDetail;
  onClick?: () => void;
}

export default function PlaceItem({ location, onClick }: PlaceItemProps) {
  const router = useRouter();

  const handlePlaceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      router.push(`/place/${location.id}`);
    }
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
              href={`/place/${location.id}`}
              className="flex min-w-0 hover:underline focus:underline focus:outline-none"
            >
              <span className="truncate text-sm font-semibold">
                {location.name}
              </span>
            </Link>
            <span className="text-muted-foreground flex-1 text-sm">{location.category}</span>
          </div>
          <span className="text-sm">{location.address}</span>
        </div>
      </div>
      <ChevronRight size={20} className="text-muted-foreground" />
    </div>
  );
}
