"use client";
import Link from "next/link";

import { HomeIcon, DollarSign, TrendingUp } from "lucide-react";
import { genres } from "../types/Genres";
import { usePathname, useSearchParams } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get("genre");

  const active =
    "flex flex-row justify-start gap-2 btn btn-ghost btn-lg btn-active";
  const inactive = "flex flex-row justify-start gap-2 btn btn-ghost btn-lg";

  return (
    <div className="hidden lg:flex flex-col p-8 bg-base-100 gap-6 max-h-screen border-r border-base-content/15 ">
      <Link
        href={"/"}
        className="flex flex-col gap-4 items-center justify-center"
      >
        <img src="/logo.png" className="w-full aspect-square max-w-[50%]" />
        <h1 className="font-bold text-4xl">psDrops</h1>
      </Link>
      <div className="flex flex-col gap-2">
        <p className="text-base-content/50 my-3">Menu</p>
        <Link href={"/"} className={pathname == "/" ? active : inactive}>
          <HomeIcon />
          <h1>Home</h1>
        </Link>
        <Link
          href={"/deals"}
          className={pathname == "/deals" ? active : inactive}
        >
          <DollarSign />
          <h1>Deals</h1>
        </Link>
        <Link
          href={"/trending"}
          className={pathname == "/trending" ? active : inactive}
        >
          <TrendingUp />
          <h1>Trending</h1>
        </Link>
      </div>
      <p className="text-base-content/50">Genres</p>
      <div className="flex flex-col gap-2 overflow-y-scroll">
        {genres.map((genre) => {
          const isActive = pathname === "/deals" && currentGenre === genre;

          return (
            <Link
              key={genre}
              href={`/deals?genre=${genre}`}
              className={isActive ? active : inactive}
            >
              <h1>{genre}</h1>
            </Link>
          );
        })}
      </div>
      <p className="text-base-content/50 text-sm self-center">
        © psDrops / mirimomekiku
      </p>
    </div>
  );
}
