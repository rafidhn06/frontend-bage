'use client';

import { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  MapPin,
  Plus,
  Star,
  Upload,
  X,
} from 'lucide-react';
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
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from '@/components/ui/file-upload';
import {
  InputGroup,
  InputGroupAddon,
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

const places = [
  {
    label:
      'Quis risus sed vulputate odio ut enim blandit volutpat maecenas volutpat blandi t aliquam etiam erat velit, scelerisque in dictum non, consectetur a! Justo, laoreet sit amet cursus sit amet, dictum?',
    value: 'bogor-botanical-gardens',
  },
  {
    label:
      'Proin libero nunc, consequat interdum varius sit amet, mattis vulputate. ',
    value: 'depok-botanical-gardens',
  },
  {
    label:
      'Facilisis volutpat, est velit egestas dui, id ornare arcu odio ut sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor elit sed vulputate? Convallis posuere morbi leo urna, molestie at elementum eu, facilisis sed.',
    value: 'bandung-botanical-gardens',
  },
  { label: 'Mount Bromo National Park', value: 'bromo-tengger-semeru' },
  { label: 'Borobudur Temple', value: 'borobudur-temple' },
  { label: 'Kuta Beach', value: 'kuta-beach' },
];

const MAX_FILES = 4;
const MAX_FILE_SIZE_MEGABYTES = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MEGABYTES * 1024 * 1024;

export default function CreatePostPage() {
  const router = useRouter();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('');

  const [rating, setRating] = useState(0);

  const [files, setFiles] = useState<File[]>([]);

  const isMaxFilesReached = files.length === MAX_FILES;

  const onFileValidate = useCallback(
    (file: File): string | null => {
      if (files.length >= MAX_FILES) {
        return `You can only upload up to ${MAX_FILES} files`;
      }

      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        return 'Only PNG, JPG, or JPEG image files are allowed';
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return `Maximum file size is ${MAX_FILE_SIZE_MEGABYTES} MB per file`;
      }

      return null;
    },
    [files]
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
      style: { backgroundColor: '#f05252', color: 'white' },
    });
  }, []);

  const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedPlace) {
      toast('Post Failed', {
        description: 'Please pin a place for your post.',
        style: { backgroundColor: '#f05252', color: 'white' },
      });
      return;
    }

    if (rating === 0) {
      toast('Post Failed', {
        description: 'Please provide a rating (1-5 stars).',
        style: { backgroundColor: '#f05252', color: 'white' },
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const caption = formData.get('caption') as string;

    const postData = {
      place: selectedPlace,
      rating: rating,
      caption: caption,
      mediaCount: files.length,
      mediaFiles: files,
    };

    console.log('Submitting Post Data:', postData);

    toast('Post Successful', {
      description: 'Your experience has been successfully shared!',
      style: { backgroundColor: '#10b981', color: 'white' },
    });

    setRating(0);
    setSelectedPlace('');
    setFiles([]);
  };

  const MAX_CHAR = 150;
  const [caption, setCaption] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length <= MAX_CHAR) {
      setCaption(value);
    }
  };

  return (
    <>
      <TopBar className="flex w-full items-center gap-3 p-4 text-xl font-semibold">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back to previous page"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </Button>
        Create Post
      </TopBar>
      <main className="flex flex-col items-center pb-[73px]">
        <div className="w-full max-w-xl">
          <form
            onSubmit={handlePostSubmit}
            className="flex flex-col gap-4 px-4 py-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Label
                  htmlFor="place"
                  className="text-md flex gap-1 leading-tight"
                >
                  Place<span className="text-red-500">*</span>
                </Label>
                <div className="flex w-full gap-2">
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="place"
                        variant="outline"
                        role="combobox"
                        aria-expanded={popoverOpen}
                        className="flex-1 justify-between"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <MapPin className="text-muted-foreground" size={16} />
                          <span className="text-muted-foreground truncate text-base font-normal md:text-sm">
                            {selectedPlace
                              ? places.find(
                                  (loc) => loc.value === selectedPlace
                                )?.label
                              : 'Select place...'}
                          </span>
                        </div>
                        <ChevronsUpDown
                          className="text-muted-foreground ml-2 shrink-0"
                          size={16}
                        />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Search place..." />
                        <CommandList>
                          <CommandEmpty>No place found.</CommandEmpty>
                          <CommandGroup>
                            {places.map((loc) => (
                              <CommandItem
                                key={loc.value}
                                value={loc.value}
                                onSelect={(currentValue) => {
                                  setSelectedPlace(
                                    currentValue === selectedPlace
                                      ? ''
                                      : currentValue
                                  );
                                  setPopoverOpen(false);
                                }}
                              >
                                {loc.label}
                                <Check
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    selectedPlace === loc.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Add new place"
                    onClick={() => router.push('/create/place')}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <input type="hidden" name="place" value={selectedPlace} />
              </div>

              <div className="xs:w-auto flex flex-1 flex-col gap-2">
                <Label
                  htmlFor="rating"
                  className="text-md flex gap-1 leading-tight"
                >
                  Rating <span className="text-red-500">*</span>
                </Label>
                <div className="xs:justify-start flex items-center justify-center">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <button
                        id="rating"
                        key={index}
                        type="button"
                        className={cn(
                          'rounded-sm p-1.5 transition-colors hover:bg-yellow-300/10 hover:text-yellow-300',
                          ratingValue <= rating
                            ? 'text-yellow-300 *:[svg]:fill-yellow-300'
                            : 'text-muted-foreground/30'
                        )}
                        onClick={() => setRating(ratingValue)}
                        aria-label={`Set rating to ${ratingValue} stars`}
                      >
                        <Star size={24} />
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="rating" value={rating} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="caption" className="text-md leading-tight">
                Caption
              </Label>
              <InputGroup>
                <InputGroupTextarea
                  id="caption"
                  name="caption"
                  placeholder="Write about your experience here..."
                  rows={4}
                  value={caption}
                  onChange={handleChange}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText
                    className={`text-xs ${
                      caption.length === MAX_CHAR
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {caption.length}/{MAX_CHAR}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-md leading-tight font-medium">Media</Label>
              <FileUpload
                value={files}
                onValueChange={setFiles}
                onFileValidate={onFileValidate}
                onFileReject={onFileReject}
                accept="image/png, image/jpg, image/jpeg"
                disabled={files.length === MAX_FILES}
                maxFiles={MAX_FILES}
                className="w-full"
                multiple
              >
                <FileUploadDropzone>
                  <div
                    className={cn('flex flex-col items-center gap-1', {
                      'opacity-50': isMaxFilesReached,
                    })}
                  >
                    <div className="mb-2 flex items-center justify-center rounded-full border p-3 text-red-500">
                      <Upload className="text-muted-foreground size-5" />
                    </div>

                    <span className="text-sm font-medium">
                      {isMaxFilesReached
                        ? `Limit Reached: max ${MAX_FILES} Images`
                        : 'Drag and drop images here'}
                    </span>

                    <span className="text-muted-foreground text-center text-xs">
                      {isMaxFilesReached
                        ? 'Please delete existing files to upload more.'
                        : `Or click to browse (max ${MAX_FILES} files, up to ${MAX_FILE_SIZE_MEGABYTES}MB each)`}
                      <br />
                      Supported File types: PNG, JPG, JPEG
                    </span>
                  </div>
                </FileUploadDropzone>
                <FileUploadList>
                  {files.map((file) => (
                    <FileUploadItem key={file.name} value={file}>
                      <FileUploadItemPreview className="select-none" />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="icon">
                          <X />
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ))}
                </FileUploadList>
              </FileUpload>
            </div>

            <div className="fixed bottom-0 left-0 z-60 flex w-dvw justify-center">
              <div className="bg-background border-border relative flex w-full max-w-xl justify-between gap-2 rounded-t-xl border-x border-t px-3 pt-3 pb-6 shadow-xs">
                <Button type="submit" className="flex-1">
                  Post
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
