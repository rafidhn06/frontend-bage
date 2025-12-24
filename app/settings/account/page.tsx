'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import * as z from 'zod';

import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const accountSchema = z
  .object({
    email: z
      .email({ message: 'Invalid email format' })
      .max(100, { message: 'Email cannot exceed 100 characters' }),
    currentPassword: z.string().nonempty('Current password is required'),
    newPassword: z
      .string()
      .max(100, { message: 'Password cannot exceed 100 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
        message: 'At least 8 characters with upper, lower, number, and symbol.',
      })
      .or(z.literal('')),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: 'Password confirmation does not match',
      path: ['confirmPassword'],
    }
  );

type AccountFormValues = z.infer<typeof accountSchema>;

export default function AccountSettingsPage() {
  const router = useRouter();
  const [responseError, setResponseError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    mode: 'onChange',
    defaultValues: {
      email: 'johndoe@example.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: AccountFormValues) => {
    try {
      // Replace with your API call
      console.log('Submitting account settings', data);
      toast('Success', { description: 'Account updated successfully' });
      reset({
        ...data,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      setResponseError('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <TopBar className="flex w-full items-center gap-3 p-4 text-xl font-semibold">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </Button>
        Account Settings
      </TopBar>

      <main className="mx-auto flex w-full max-w-xl flex-col pb-[73px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4 py-6"
        >
          <section className="border-border flex flex-col gap-4 border-solid pb-6">
            <span className="text-xl leading-tight font-semibold md:text-lg">
              Account Info
            </span>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-base md:text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <span className="text-destructive text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <span className="text-xl leading-tight font-semibold md:text-lg">
              Change Password
            </span>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="current-password"
                className="text-base md:text-sm"
              >
                Current Password
              </Label>
              <Input
                id="current-password"
                type={showPassword ? 'text' : 'password'}
                {...register('currentPassword')}
                className={errors.currentPassword ? 'border-destructive' : ''}
              />
              {errors.currentPassword && (
                <span className="text-destructive text-sm">
                  {errors.currentPassword.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password" className="text-base md:text-sm">
                New Password
              </Label>
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                {...register('newPassword')}
                className={errors.newPassword ? 'border-destructive' : ''}
              />
              {errors.newPassword && (
                <span className="text-destructive text-sm">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="confirm-password"
                className="text-base md:text-sm"
              >
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <span className="text-destructive text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Checkbox
                id="show-password"
                checked={showPassword}
                onCheckedChange={(checked) => setShowPassword(!!checked)}
              />
              <label htmlFor="show-password" className="text-sm font-normal">
                Show passwords
              </label>
              {responseError && (
                <span className="text-destructive mt-2 text-sm">
                  {responseError}
                </span>
              )}
            </div>
          </section>

          <div className="fixed bottom-0 left-0 z-60 flex w-dvw justify-center">
            <div className="bg-background border-border relative flex w-full max-w-xl justify-between gap-2 rounded-t-xl border-x border-t px-3 pt-3 pb-6 shadow-xs">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
