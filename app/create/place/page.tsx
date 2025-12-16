'use client';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft,
  Coffee,
  Ellipsis,
  Hotel,
  Landmark,
  Mountain,
  Trees,
  Utensils,
} from 'lucide-react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';

import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// untuk helper classnames

const MAX_NAME = 100;
const MAX_ADDRESS = 150;
const MAX_DESC = 150;

const JAKARTA_CENTER: [number, number] = [-6.2, 106.816666];
const PlaceMap = dynamic(() => import('@/components/PlaceMap'), { ssr: false });

// Kategori
const categories = [
  { name: 'Kafe', icon: 'coffee' },
  { name: 'Restoran', icon: 'utensils' },
  { name: 'Taman', icon: 'tree' },
  { name: 'Museum', icon: 'landmark' },
  { name: 'Hotel', icon: 'hotel' },
  { name: 'Wisata Alam', icon: 'mountain' },
  { name: 'Lainnya', icon: 'ellipsis' },
];

// Helper untuk icon lucide-react
const categoryIconMap: Record<
  string,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  coffee: Coffee,
  utensils: Utensils,
  tree: Trees,
  landmark: Landmark,
  hotel: Hotel,
  mountain: Mountain,
  ellipsis: Ellipsis,
};

export default function CreatePlacePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const [mapCenter, setMapCenter] = useState<[number, number]>(JAKARTA_CENTER);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

  useEffect(() => {
    const getLocationFromIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();

        if (data.latitude && data.longitude && data.country === 'ID') {
          const lat = Number(data.latitude);
          const lng = Number(data.longitude);

          setMapCenter([lat, lng]);
          setPosition([lat, lng]);
        }
      } catch (error) {
        console.error('IP location failed', error);
      }
    };

    const getLocationFromGPS = () => {
      if (!navigator.geolocation) {
        getLocationFromIP();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter([latitude, longitude]);
          setPosition([latitude, longitude]);
        },
        () => {
          getLocationFromIP();
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0,
        }
      );
    };

    getLocationFromGPS();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!position) {
      toast('Create Place Failed', {
        description: 'Please select a location on the map.',
        style: { backgroundColor: '#f05252', color: 'white' },
      });
      return;
    }

    if (!selectedCategory) {
      toast('Create Place Failed', {
        description: 'Please select a category.',
        style: { backgroundColor: '#f05252', color: 'white' },
      });
      return;
    }

    const placeData = {
      name,
      address,
      description,
      latitude: position[0],
      longitude: position[1],
      category: selectedCategory,
    };

    console.log('Submitting Place Data:', placeData);

    toast('Place Created', {
      description: 'The place has been successfully added.',
      style: { backgroundColor: '#10b981', color: 'white' },
    });

    router.back();
  };

  return (
    <>
      <TopBar className="flex w-full items-center gap-3 p-4 text-xl font-semibold">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </Button>
        Create Place
      </TopBar>

      <main className="flex flex-col items-center pb-[73px]">
        <div className="w-full max-w-xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 px-4 py-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 flex-col gap-2">
                <Label
                  className="text-md flex gap-1 leading-tight"
                  htmlFor="name"
                >
                  Place Name<span className="text-red-500">*</span>
                </Label>
                <InputGroup>
                  <InputGroupInput
                    id="name"
                    placeholder="Enter place name..."
                    value={name}
                    onChange={(e) =>
                      e.target.value.length <= MAX_NAME &&
                      setName(e.target.value)
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText className="text-muted-foreground text-xs">
                      {name.length}/{MAX_NAME}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <Label className="text-md flex gap-1 leading-tight">
                  Category<span className="text-red-500">*</span>
                </Label>

                <Popover
                  open={categoryPopoverOpen}
                  onOpenChange={setCategoryPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryPopoverOpen}
                      className="flex justify-between"
                    >
                      <div className="flex items-center gap-2 text-base font-normal md:text-sm">
                        {selectedCategory ? (
                          <>
                            {/* Langsung render JSX */}
                            {(() => {
                              const IconComponent =
                                categoryIconMap[
                                  categories.find(
                                    (c) => c.name === selectedCategory
                                  )!.icon
                                ];
                              return <IconComponent size={16} />;
                            })()}
                            <span>{selectedCategory}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">
                            Select category...
                          </span>
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2" size={16} />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((cat) => {
                            const IconComponent = categoryIconMap[cat.icon];
                            return (
                              <CommandItem
                                key={cat.name}
                                value={cat.name}
                                onSelect={(currentValue) => {
                                  setSelectedCategory(currentValue);
                                  setCategoryPopoverOpen(false);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <IconComponent size={16} />
                                  {cat.name}
                                </div>
                                <Check
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    selectedCategory === cat.name
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2">
              <Label
                className="text-md flex gap-1 leading-tight"
                htmlFor="address"
              >
                Address<span className="text-red-500">*</span>
              </Label>
              <InputGroup>
                <InputGroupTextarea
                  id="address"
                  rows={3}
                  placeholder="Enter full address..."
                  value={address}
                  onChange={(e) =>
                    e.target.value.length <= MAX_ADDRESS &&
                    setAddress(e.target.value)
                  }
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="text-muted-foreground text-xs">
                    {address.length}/{MAX_ADDRESS}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Category Selector */}

            {/* Map */}
            <div className="flex flex-col gap-2">
              <Label className="text-md flex gap-1 leading-tight">
                Pin Location<span className="text-red-500">*</span>
              </Label>
              <div className="h-[300px] overflow-hidden rounded-md border">
                <PlaceMap
                  center={mapCenter}
                  position={position}
                  onSelect={(lat, lng) => setPosition([lat, lng])}
                />
              </div>
              <span className="text-muted-foreground text-xs">
                Location:
                {position && (
                  <>
                    {' '}
                    {position[0].toFixed(5)}, {position[1].toFixed(5)}
                  </>
                )}
              </span>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label className="text-md leading-tight" htmlFor="description">
                Description
              </Label>
              <InputGroup>
                <InputGroupTextarea
                  id="description"
                  rows={4}
                  placeholder="Describe this place..."
                  value={description}
                  onChange={(e) =>
                    e.target.value.length <= MAX_DESC &&
                    setDescription(e.target.value)
                  }
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="text-muted-foreground text-xs">
                    {description.length}/{MAX_DESC}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Submit Button */}
            <div className="fixed bottom-0 left-0 z-9999 flex w-dvw justify-center">
              <div className="bg-background border-border relative flex w-full max-w-xl justify-between gap-2 rounded-t-xl border-x border-t px-3 pt-3 pb-6 shadow-xs">
                <Button type="submit" className="flex-1">
                  Create Place
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
