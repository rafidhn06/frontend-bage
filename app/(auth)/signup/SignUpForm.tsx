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
      .max(100, { message: 'Password cannot exceed 100 characters.' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
        message: 'At least 8 characters with upper, lower, number, and symbol.',
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



  // ...

  async function onSubmit(data: FormValues) {
    try {
      await api.post('/auth/register', {
        name: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      });

      router.push('/feed');
    } catch (error) {
      // Assuming 422 or similar for validation errors, or failure response from backend
      setResponseError('Email or username is taken');
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
            className={errors.fullName ? 'border-destructive' : ''}
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
            className={errors.username ? 'border-destructive' : ''}
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
            className={errors.email ? 'border-destructive' : ''}
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
            className={errors.password ? 'border-destructive' : ''}
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
            className={errors.passwordConfirmation ? 'border-destructive' : ''}
          />
          {errors.passwordConfirmation && (
            <span className="text-destructive text-sm">
              {errors.passwordConfirmation.message}
            </span>
          )}
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
