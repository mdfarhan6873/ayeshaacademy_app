"use client";

import useBackButtonHandler from "@/hooks/useBackButtonHandler";
import { SessionProvider } from "next-auth/react";

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  useBackButtonHandler();
  return <SessionProvider>{children}</SessionProvider>;
}
