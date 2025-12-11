'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Email or username is required' })
    .max(100, { message: 'Identifier cannot exceed 100 characters' })
    .regex(/^\S+$/, { message: 'Username cannot contain spaces' }),

  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(255, { message: 'Password cannot exceed 255 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: data.username,
            password: data.password,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setResponseError('Invalid email or password');
        return;
      }

      const token = json.access_token;
      if (token) {
        localStorage.setItem('access_token', token);

        router.push('/feed');
      }
    } catch {
      setResponseError('Something went wrong. Please try again later');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="identifier" className="sr-only">
            Email or username
          </label>
          <Input
            id="identifier"
            type="text"
            placeholder="Email or username"
            autoComplete="username"
            {...register('username')}
          />
          {errors.username && (
            <span className="text-destructive text-sm">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-destructive text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="show-password"
          checked={showPassword}
          onCheckedChange={(checked) => setShowPassword(!!checked)}
        />
        <label
          htmlFor="show-password"
          className="text-secondary-foreground font-normal"
        >
          Show password
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <Button
          type="submit"
          className="w-full cursor-pointer rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner aria-hidden className="inline-block" />}
          {isSubmitSuccessful && !responseError
            ? "you're good to go :D"
            : 'Sign In'}
        </Button>
        {responseError && (
          <span className="text-destructive text-sm">{responseError}</span>
        )}
      </div>
    </form>
  );
}
