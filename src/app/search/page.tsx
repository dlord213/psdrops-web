"use client";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, LoaderPinwheel } from "lucide-react";

const Component = () => {
  const params = useSearchParams();
  const query = params.get("query");
  const [page, setPage] = useState(1);

  const { data: deals } = useQuery({
    queryKey: ["search-deals", query, page],
    queryFn: async () => {
      try {
        const data = await (
          await fetch(`/api/search?query=${query}&page=${page}`)
        ).json();


        return data;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!query,
    refetchOnWindowFocus: false,
  });

  if (!deals) {
    return (
      <div className="items-center justify-center flex flex-col lg:min-h-[80vh] xl:min-h-[88vh] 2xl:min-h-[90vh] min-h-screen">
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
      {deals && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-4 rounded-2xl">
          {deals &&
            deals.games.length > 0 &&
            deals.games.map(
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
                    <div className="flex flex-row items-center gap-2">
                      <h1 className="font-bold">{game.price}</h1>
                      <p className="line-through text-base-content/50">
                        {game.originalPrice}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            )}
        </div>
      )}
      <div className="flex flex-row items-center gap-2 md:self-end">
        <button
          className="btn flex-1 px-8"
          onClick={() => {
            if (page == 1) return;

            setPage((prev) => prev - 1);
          }}
        >
          <ArrowLeft />
        </button>
        <button
          className="btn flex-1 px-8"
          onClick={() => {
            setPage((prev) => prev + 1);
          }}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <Component />
    </Suspense>
  );
}
