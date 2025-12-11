import { Toaster } from 'sonner';

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster position="top-right" style={{ top: '68px' }} />
    </>
  );
}
