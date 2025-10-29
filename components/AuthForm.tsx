'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

type Mode = 'login' | 'register';

interface ApiSuccess {
  access_token?: string;
  token_type?: string;
  [k: string]: unknown;
}
interface ApiError {
  message?: string;
  error?: string;
  [k: string]: unknown;
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isRegister = mode === 'register';

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const path = isRegister ? '/api/auth/register' : '/api/auth/login';
      const url = API_BASE ? `${API_BASE}${path}` : path;

      let payload: Record<string, string>;
      if (isRegister) {
        payload = {
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
          password,
          password_confirmation: confirmPassword,
        };
      } else {
        payload = {
          credential: email.trim(),
          password,
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => ({}))) as
        | ApiSuccess
        | ApiError;

      if (!res.ok) {
        const apiMsg =
          (json as ApiError)?.message ||
          (json as ApiError)?.error ||
          `Request failed with status ${res.status}`;
        setError(String(apiMsg));
        return;
      }

      const success = json as ApiSuccess;

      const accessTokenValue = success?.access_token;

      if (isRegister) {
        router.push('/login');
        return;
      }

      if (accessTokenValue) {
        router.push('/feed');
        return;
      }

      setError('Login successful, but no authentication token was provided.');
    } catch (err: unknown) {
      let message = 'An unexpected error occurred.';
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-wrap items-center justify-center gap-28 p-4">
      <div className="relative bottom-6 flex flex-col gap-2">
        <span className={`${fredoka.className} text-9xl leading-tight`}>
          bage
        </span>
        <span className="text-2xl leading-tight text-slate-600">
          Every place has a story to share
        </span>
      </div>

      <div className="w-full max-w-[22rem]">
        <div className="mb-4 flex flex-col gap-1">
          <span className="text-2xl font-semibold">
            {isRegister ? 'Create your account' : 'Welcome'}
          </span>
          <span className="text-sm text-slate-600">
            {isRegister
              ? 'Join us to start sharing and discovering places'
              : 'Sign in to continue'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {isRegister && (
            <>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
              />
              <Input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </>
          )}

          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isRegister ? 'Email' : 'Email or username'}
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          {isRegister && (
            <>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </>
          )}

          {error && (
            <div className="text-sm text-red-600" role="alert">
              {error}
            </div>
          )}

          <nav className="text-sm">
            <span className="text-slate-600">
              {isRegister
                ? 'Already have an account? '
                : "Don't have an account? "}
            </span>
            <Link
              href={isRegister ? '/login' : '/register'}
              className="text-sky-600 hover:underline"
            >
              {isRegister ? 'Sign in' : 'Sign up'}
            </Link>
          </nav>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-4xl font-bold"
            title={isLoading ? 'Please wait...' : undefined}
          >
            {isLoading
              ? isRegister
                ? 'Creating...'
                : 'Signing in...'
              : isRegister
                ? 'Sign up'
                : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
