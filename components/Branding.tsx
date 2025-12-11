import { Fredoka } from 'next/font/google';
import Image from 'next/image';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
});

export default function Branding() {
  return (
    <>
      <div className="flex w-full max-w-80 grow-2 flex-col items-start justify-end gap-2 md:w-fit md:max-w-none md:grow-0 md:pb-8">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={79}
          height={34.34}
          className="md:w-[212px]"
        />
        <span className="text-secondary-foreground hidden leading-tight font-light md:inline md:text-2xl lg:inline">
          Every place has a story
        </span>
      </div>
    </>
  );
}
