"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import {
  getMonthFromIndex,
  getDayFromIndex,
  getWeekdayFromIndex,
} from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const weekday = currentTime.getDay();
  const day = currentTime.getDate() - 1;
  const month = currentTime.getMonth();

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-transparent absolute top-0 left-0 right-0 flex items-center justify-between h-10 px-5 py-8">
      <div className="flex h-3.5 items-center gap-3">
        <p className="text-lg dark:text-white text-dark">{formattedTime}</p>
        <Separator
          className="dark:bg-[#ffffff1c] bg-slate-400"
          orientation="vertical"
        />
        <p className="dark:text-[#ffffff80] text-dark">
          {new Date().getFullYear()}
        </p>
      </div>

      <div className="text-sm uppercase mr-20 dark:text-[#ffffff80] text-dark flex gap-1.5">
        <p>{getWeekdayFromIndex(weekday)}</p>
        <span className="dark:text-white text-dark font-semibold">
          {getDayFromIndex(day)}
        </span>{" "}
        <span className="dark:text-white text-dark font-semibold">
          {getMonthFromIndex(month)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {mounted ? (
          <button
            aria-label="theme button"
            className="rounded-lg p-2 duration-300"
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }}
            type="button"
          >
            {resolvedTheme === "dark" && (
              <Sun aria-hidden="true" className="h-5 w-5" />
            )}
            {resolvedTheme === "light" && (
              <Moon aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        ) : null}
        <div aria-hidden className="w-px h-3 mr-2 dark:bg-[#c7c7c8d0] bg-[#c7c7c8]" />
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "size-6",
            },
          }}
        />
      </div>
    </div>
  );
}
