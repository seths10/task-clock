import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
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
