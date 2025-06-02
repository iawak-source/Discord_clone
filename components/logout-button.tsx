"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
  const { signOut } = useClerk();

  return (
    <div className="h-8"></div>
  );
};
