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

export const formSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: 'Name is required.' })
      .max(100, { message: 'Name cannot exceed 100 characters.' }),

    username: z
      .string()
      .min(1, { message: 'Username is required.' })
      .max(50, { message: 'Username cannot exceed 50 characters.' })
      .regex(/^\S+$/, { message: 'Username cannot contain spaces.' }),

    email: z
      .email({ message: 'Email format is invalid.' })
      .max(100, { message: 'Email cannot exceed 100 characters.' }),

    password: z
      .string()
      .max(72, { message: 'Password cannot exceed 72 characters.' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
        message:
          'Password must be at least 8 characters and include upper, lower, number and symbol.',
      }),

    passwordConfirmation: z
      .string()
      .min(1, { message: 'Password confirmation is required.' }),
  })

  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Password confirmation does not match.',
    path: ['passwordConfirmation'],
  });

type FormValues = z.infer<typeof formSchema>;

export default function SignUpForm() {
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
      fullName: '',
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.fullName,
            username: data.username,
            email: data.email,
            password: data.password,
            password_confirmation: data.passwordConfirmation,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setResponseError('Email or username is taken');
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      autoComplete="off"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Input
            id="full-name"
            type="text"
            placeholder="Full name"
            {...register('fullName')}
            aria-label="Full name"
          />
          {errors.fullName && (
            <span className="text-destructive text-sm">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Input
            id="username"
            type="text"
            placeholder="Username"
            {...register('username')}
            aria-label="Username"
          />
          {errors.username && (
            <span className="text-destructive text-sm">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Input
            id="email"
            type="text"
            placeholder="Email"
            {...register('email')}
            aria-label="Email"
          />
          {errors.email && (
            <span className="text-destructive text-sm">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password')}
            aria-label="Password"
          />
          {errors.password && (
            <span className="text-destructive text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            {...register('passwordConfirmation')}
            aria-label="Password confirmation"
          />
          {errors.passwordConfirmation && (
            <span className="text-destructive text-sm">
              {errors.passwordConfirmation.message}
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
