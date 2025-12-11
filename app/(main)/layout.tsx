import { Toaster } from 'sonner';

import NavigationBar from '@/components/NavigationBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <NavigationBar />
    </>
  );
}
