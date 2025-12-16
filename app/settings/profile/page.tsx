'use client';

import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import * as z from 'zod';

import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Schema Zod
const profileSchema = z.object({
  username: z
    .string()
    .max(50, { message: 'Username cannot exceed 50 characters.' })
    .regex(/^\S*$/, { message: 'Username cannot contain spaces.' })
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(150, { message: 'Bio cannot exceed 150 characters.' })
    .optional()
    .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  // Initial values
  const [username, setUsername] = useState('johndoe');
  const [bio, setBio] = useState(
    'Just an ordinary family man. Sometimes a doctor.'
  );

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username,
      bio,
    },
    mode: 'onChange',
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      alert('Only PNG, JPG, or JPEG files are allowed.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.');
      return;
    }

    setSelectedFile(file);
    setCroppedImage(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCroppedImage(null);
  };

  const onSubmit = (data: ProfileFormValues) => {
    console.log({
      username: data.username,
      bio: data.bio,
      profileImage: croppedImage,
    });
    alert('Profile updated!');
    setUsername(data.username || '');
    setBio(data.bio || '');
  };

  return (
    <>
      <TopBar className="flex w-full items-center gap-3 px-4 py-4 text-xl font-semibold">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </Button>
        <span>Profile Settings</span>
      </TopBar>

      <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6 pb-[78px]">
        {/* Profile Picture */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="profilePicture"
              className="text-md flex gap-1 leading-tight"
            >
              Profile Picture
            </Label>
            <Input
              id="profilePicture"
              accept="image/png, image/jpg, image/jpeg"
              type="file"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && !croppedImage && (
            <span>Preview / Crop here (not implemented)</span>
          )}

          {croppedImage && <span>Preview / Crop here (not implemented)</span>}
        </div>

        {/* Username */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="username"
            className="text-md flex gap-1 leading-tight"
          >
            Username
          </Label>
          <Input
            id="username"
            {...register('username')}
            className={errors.username ? 'border-destructive' : ''}
          />
          {errors.username && (
            <span className="text-destructive text-sm">
              {errors.username.message}
            </span>
          )}
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="bio" className="text-md flex gap-1 leading-tight">
            Bio
          </Label>
          <Textarea
            id="bio"
            {...register('bio')}
            className={errors.bio ? 'border-destructive' : ''}
          />
          {errors.bio && (
            <span className="text-destructive text-sm">
              {errors.bio.message}
            </span>
          )}
        </div>

        <div className="fixed bottom-0 left-0 z-60 flex w-dvw justify-center">
          <div className="bg-background border-border relative flex w-full max-w-xl justify-between gap-2 rounded-t-xl border-x border-t px-3 pt-3 pb-6 shadow-xs">
            <Button
              type="submit"
              className="flex-1"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              Save changes
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
