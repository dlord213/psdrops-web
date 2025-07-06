"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderPinwheel } from "lucide-react";

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();

  const genre = params.get("genre");
  const page = parseInt(params.get("page") || "1");

  const { data: deals } = useQuery({
    queryKey: ["deals", genre, page],
    queryFn: async () => {
      const res = await fetch(
        `/api/deals?page=${page}${genre ? `&genre=${genre}` : ""}`
      );
      return res.json();
    },
    enabled: !!page,
    refetchOnWindowFocus: false,
  });

  const goToPage = (newPage: number) => {
    const search = new URLSearchParams(params);
    search.set("page", newPage.toString());
    router.push(`?${search.toString()}`);
  };

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
      </div>
      {deals && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-4 rounded-2xl">
          {deals.games.map(
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
                className="flex flex-col rounded-xl bg-base-100 h-full"
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
            )
          )}
        </div>
      )}
      <div className="flex flex-row items-center gap-2 md:self-end">
        <button
          className="btn flex-1 px-8"
          onClick={() => {
            if (page > 1) goToPage(page - 1);
          }}
        >
          <ArrowLeft />
        </button>
        <button className="btn flex-1 px-8" onClick={() => goToPage(page + 1)}>
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
