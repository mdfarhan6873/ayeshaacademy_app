"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";

export default function useBackButtonHandler() {
  const router = useRouter();

  useEffect(() => {
    let listener: { remove: () => void } | null = null;

    const setupListener = async () => {
      const handler = await App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          router.back();
        } else {
          // Exit the app if no history is available
          App.exitApp();
        }
      });

      listener = handler;
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [router]);
}
