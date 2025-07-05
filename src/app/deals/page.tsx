"use client";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, LoaderPinwheel } from "lucide-react";

export default function Page() {
  const params = useSearchParams();
  const genre = params.get("genre");
  const [page, setPage] = useState(1);

  const { data: hottestDeals } = useQuery({
    queryKey: [page, "deals", genre],
    queryFn: async () => {
      try {
        const data = await (
          await fetch(
            `http://localhost:3000/api/deals?page=${page}${
              genre ? `&genre=${genre}` : ""
            }`
          )
        ).json();

        console.log(data);

        return data;
      } catch (err) {
        throw err;
      }
    },
  });

  if (!hottestDeals) {
    return (
      <div className="items-center justify-center flex flex-col 2xl:min-h-[90vh]">
        <LoaderPinwheel className="animate-spin" size={96} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 overflow-y-scroll xl:max-h-[90vh]">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-bold text-4xl">Hottest Deals</h1>
        <div className="flex flex-row items-center gap-2">
          <button className="btn px-8">
            <ArrowLeft />
          </button>
          <button className="btn px-8">
            <ArrowRight />
          </button>
        </div>
      </div>
      {hottestDeals && (
        <div className="grid grid-cols-4 items-center gap-4 rounded-2xl">
          {hottestDeals &&
            hottestDeals.games.length > 0 &&
            hottestDeals.games.map((game) => (
              <Link
                href={`/game/${game.link}`}
                key={game.link}
                className="flex flex-col rounded-xl bg-base-100 rounded-tr-2xl rounded-tl-2xl h-full"
              >
                <img src={game.imgSrc} className="w-full h-full object-cover" />
                <div className="p-4">
                  <h1 className="text-lg font-bold">{game.productTitle}</h1>
                  <div className="flex flex-row items-center gap-2">
                    <h1 className="font-bold">{game.price}</h1>
                    <p className="line-through text-base-content/50">
                      {game.originalPrice}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
      <div className="flex flex-row items-center gap-2 self-end">
        <button
          className="btn px-8"
          onClick={() => {
            if (page == 1) return;

            setPage((prev) => prev - 1);
          }}
        >
          <ArrowLeft />
        </button>
        <button
          className="btn px-8"
          onClick={() => {
            setPage((prev) => prev + 1);
          }}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
