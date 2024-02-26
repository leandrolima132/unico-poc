import { UnicoProvider } from "@/contexts/unico-context";
import { ReactNode } from "react";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    // w-full max-w-[1600px] grid-rows-app gap-5 px-8 py-8
    <UnicoProvider>
      <div className="mx-auto grid min-h-screen">{children}</div>
    </UnicoProvider>
  );
}
