import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Welcome to Task Clock!
            </h1>
            <p className="text-muted-foreground text-sm">
              Start clocking your tasks by logging in below.
            </p>
          </div>
          <SignedIn>
            <Link href="/home">
              <Button
                variant="outline"
                className="fancy-border-gradient hover:bg-background relative mx-auto flex gap-4 border-none"
              >
                Clock Tasks
              </Button>
            </Link>
          </SignedIn>
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
