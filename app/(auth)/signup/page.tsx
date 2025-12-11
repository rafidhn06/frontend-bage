import type { Metadata } from 'next';

import AuthForm from '@/components/AuthForm';

import SignUpForm from './SignUpForm';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
  return (
    <AuthForm
      title="Create your account"
      description="Join us to start sharing your stories"
      form={<SignUpForm />}
      linkText="Already have an account?"
      linkHref="/login"
    />
  );
}
