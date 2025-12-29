'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import api from '@/lib/axios';
import { AxiosError } from 'axios';

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



  // ... (imports remain)

  // ...

  async function onSubmit(data: FormValues) {
    try {
      await api.post('/auth/login', {
        credential: data.username,
        password: data.password,
      });

      router.push('/feed');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        setResponseError('Invalid email or password');
      } else {
        setResponseError('Something went wrong. Please try again later');
      }
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
          className="text-secondary-foreground text-sm font-normal"
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
