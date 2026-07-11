import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  stubTitle: string;
  stubSubtitle: string;
}

export default function AuthLayout({
  children,
  stubTitle,
  stubSubtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F7F8] px-4 py-10">
      <div className="w-full max-w-3xl flex rounded-2xl overflow-hidden shadow-xl bg-white">
        <div className="hidden sm:flex flex-col justify-between w-64 shrink-0 bg-gradient-to-b from-[#0D98BA] to-[#086A82] text-white p-8 relative">
          <div>
            <div className="text-xs uppercase tracking-widest text-teal-100 font-semibold">
              Flash Company
            </div>
            <div className="mt-1 text-lg font-bold leading-snug">
              ICT Help Desk
            </div>
          </div>

          <div>
            <div className="text-sm text-teal-50/90 font-medium">{stubTitle}</div>
            <div className="mt-1 text-xs text-teal-100/80">{stubSubtitle}</div>
          </div>

          <div className="absolute top-0 right-0 h-full w-0 flex flex-col justify-around items-center py-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="block w-3 h-3 rounded-full bg-[#F4F7F8] translate-x-1/2"
              />
            ))}
          </div>
        </div>

        <div className="hidden sm:block w-px border-l-2 border-dashed border-white/40 -ml-px" />

        <div className="flex-1 p-8 sm:p-10">{children}</div>
      </div>
    </div>
  );
}
