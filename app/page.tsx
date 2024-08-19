"use client";

import * as React from "react";
import { SignInButton, useAuth, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded && userId) {
      router.push("/home");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded || userId) {
    return null;
  }

  return (
    <div className="flex absolute inset-0 -z-10 h-screen items-center justify-center w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight dark:text-neutral-800 text-neutral-900">
              Welcome to Task Clock!
            </h1>
            <p className="text-muted-foreground text-sm">
              Start clocking your tasks by logging in below.
            </p>
          </div>
          <SignedOut>
            <SignInButton>
              <Button
                variant="outline"
                className="fancy-border-gradient hover:bg-background relative mx-auto flex gap-4 border-none"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
