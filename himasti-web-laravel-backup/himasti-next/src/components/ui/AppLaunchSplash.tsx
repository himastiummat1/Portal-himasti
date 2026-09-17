"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const TetrisSplash = dynamic(() => import("@/components/ui/TetrisSplash"), {
  ssr: false,
});

export default function AppLaunchSplash() {
  const [shouldShow, setShouldShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Jangan tampilkan jika sedang di halaman preview
    if (pathname?.startsWith("/preview-splash")) {
      return;
    }

    // Cek apakah sudah pernah boot dalam sesi ini
    const booted = sessionStorage.getItem("himasti_splash_booted");
    if (!booted) {
      setShouldShow(true);
    }
  }, [pathname]);

  if (!shouldShow) return null;

  return (
    <TetrisSplash
      onComplete={() => {
        sessionStorage.setItem("himasti_splash_booted", "true");
        setShouldShow(false);
      }}
      autoClose={true}
    />
  );
}
