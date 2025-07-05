"use client";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ArrowRight, LoaderPinwheel } from "lucide-react";

export default function Page() {
  const [page, setPage] = useState(1);

  const { data: trendingDeals } = useQuery({
    queryKey: [page, "deals"],
    queryFn: async () => {
      try {
        const data = await (await fetch(`/api/trending?page=${page}`)).json();

        console.log(data);

        return data;
      } catch (err) {
        throw err;
      }
    },
  });

  if (!trendingDeals) {
    return (
      <div className="items-center justify-center flex flex-col 2xl:min-h-[90vh]">
        <LoaderPinwheel className="animate-spin" size={96} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 overflow-y-scroll xl:max-h-[90vh]">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-bold text-4xl">Trending Deals</h1>
        <div className="flex flex-row items-center gap-2">
          <button className="btn px-8">
            <ArrowLeft />
          </button>
          <button className="btn px-8">
            <ArrowRight />
          </button>
        </div>
      </div>
      {trendingDeals && (
        <div className="grid grid-cols-4 items-center gap-4 rounded-2xl">
          {trendingDeals &&
            trendingDeals.games.length > 0 &&
            trendingDeals.games.map(
              (game: {
                link: string;
                imgSrc: string;
                productTitle: string;
                price: string;
                originalPrice: string;
              }) => (
                <Link
                  href={`/game/${game.link}`}
                  key={game.link}
                  className="flex flex-col rounded-xl bg-base-100 rounded-tr-2xl rounded-tl-2xl h-full"
                >
                  <img
                    src={game.imgSrc}
                    className="w-full h-full object-cover"
                  />
                  <div className="p-4">
                    <h1 className="text-lg font-bold">{game.productTitle}</h1>
                    {!game.price ? (
                      <div className="flex flex-row items-center gap-2">
                        <h1 className="font-bold">{game.originalPrice}</h1>
                      </div>
                    ) : (
                      <div className="flex flex-row items-center gap-2">
                        <h1 className="font-bold">{game.price}</h1>
                        <p className="line-through text-base-content/50">
                          {game.originalPrice}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              )
            )}
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
