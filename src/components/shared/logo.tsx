import Image from "next/image";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/logo.jpg"
        alt="Maidev Express"
        width={180}
        height={120}
        priority
        className="h-14 w-auto rounded-xl object-contain"
      />
    </div>
  );
}
