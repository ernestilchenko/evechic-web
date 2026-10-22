import { Logo } from "@/components/layout/Logo";

import { AuthVisual } from "./AuthVisual";

type AuthLayoutProps = { image: string | null; children: React.ReactNode };

export function AuthLayout({ image, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(420px,600px)_1fr]">
      <AuthVisual image={image} />
      <div className="flex flex-col px-4 py-8 sm:px-8 lg:px-20">
        <div className="flex justify-center lg:justify-start">
          <Logo />
        </div>
        <main id="main" className="flex flex-1 items-center justify-center py-12">
          <div className="flex w-full max-w-[420px] flex-col gap-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
