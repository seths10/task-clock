"use client";

import { Separator } from "@/components/ui/separator";
import {
  getMonthFromIndex,
  getDayFromIndex,
  getWeekdayFromIndex,
} from "@/lib/utils";

export default function Navbar() {
  const weekday = new Date().getDay();
  const day = new Date().getDay();
  const month = new Date().getMonth();

  return (
    <div className="bg-transparent absolute top-0 left-0 right-0 flex items-center justify-between h-10 px-5 py-8">
      <div className="flex h-3.5 items-center gap-3">
        <p className="text-lg text-white">
          {/* //TODO: Add time */}
          {'TIME HERE'}
        </p>
        <Separator className="bg-[#ffffff1c]" orientation="vertical" />
        <p className="text-[#ffffff80]">{new Date().getFullYear()}</p>
      </div>
      <div className="text-sm uppercase text-[#ffffff80] flex gap-1.5">
        <p>{getWeekdayFromIndex(weekday)}</p>
        <span className="text-white">{getDayFromIndex(day)}</span>{" "}
        <span className="text-white">{getMonthFromIndex(month)}</span>
      </div>
      <div></div>
    </div>
  );
}
