import type { Metadata } from 'next';

import AuthForm from '@/components/AuthForm';

import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <AuthForm
      title="Welcome"
      description="Sign in to continue"
      form={<LoginForm />}
      linkText="Don't have an account?"
      linkHref="/signup"
    />
  );
}
