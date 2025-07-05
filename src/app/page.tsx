import Link from "next/link";

import { ChevronRight } from "lucide-react";

export default async function Home() {
  const [hottestDeals, mostWantedDeals, mostOwnedDeals, dlcsDeals] =
    await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals`, {
        method: "GET",
      }).then((res) => res.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/deals?page=1&sort=most_wanted`,
        {
          method: "GET",
        }
      ).then((res) => res.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/deals?page=1&sort=most_owned`,
        {
          method: "GET",
        }
      ).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals?type=dlc`, {
        method: "GET",
      }).then((res) => res.json()),
    ]);

  return (
    <div className="flex flex-col gap-6 p-8 overflow-y-scroll lg:min-h-[86vh] lg:max-h-[86vh] xl:min-h-[88vh] xl:max-h-[88vh] 2xl:min-h-[90vh] 2xl:max-h-[90vh] bg-base-300">
      {/* Hottest deals */}
      <div>
        <Link
          href={"/deals"}
          className="font-bold text-4xl w-fit hover:scale-105 transition-all delay-0 duration-300"
        >
          Hottest deals
        </Link>
        <Link
          href={"/deals"}
          className="flex flex-row items-center gap-1 text-base-content/40 font-bold w-fit hover:scale-105 transition-all delay-0 duration-300"
        >
          <p>View all</p>
          <ChevronRight />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-4 rounded-2xl">
        {hottestDeals &&
          hottestDeals.games.length > 0 &&
          hottestDeals.games
            .splice(0, 6)
            .map(
              (game: {
                link: string;
                imgSrc: string | Blob | undefined;
                productTitle: string;
                price: string;
                originalPrice: string;
              }) => (
                <Link
                  href={`/game/${game.link}`}
                  key={game.link}
                  className="h-full flex flex-col rounded-xl bg-base-100 rounded-tr-2xl rounded-tl-2xl"
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
      {/* Hottest deals */}

      {/* Most wanted deals */}
      <div>
        <Link
          href={"/deals/most-wanted"}
          className="font-bold text-4xl w-fit hover:scale-105 transition-all delay-0 duration-300"
        >
          Most wanted
        </Link>
        <Link
          href={"/deals/most-wanted"}
          className="flex flex-row items-center gap-1 text-base-content/40 font-bold w-fit hover:scale-105 transition-all delay-0 duration-300"
        >
          <p>View all</p>
          <ChevronRight />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-4 rounded-2xl">
        {mostWantedDeals &&
          mostWantedDeals.games.length > 0 &&
          mostWantedDeals.games
            .splice(0, 4)
            .map(
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
                  className="h-full flex flex-col rounded-xl bg-base-100 rounded-tr-2xl rounded-tl-2xl"
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
      {/* Most wanted deals */}

      {/* Most owned deals */}
      <div>
        <Link
          href={"/deals/most-owned"}
          className="font-bold text-4xl w-fit hover:scale-105 transition-all delay-0 duration-300"
        >
          Most owned
        </Link>
        <Link
          href={"/deals/most-owned"}
          className="flex flex-row items-center gap-1 text-base-content/40 font-bold w-fit hover:scale-105 transition-all delay-0 duration-300"
        >
          <p>View all</p>
          <ChevronRight />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-4 rounded-2xl">
        {mostOwnedDeals &&
          mostOwnedDeals.games.length > 0 &&
          mostOwnedDeals.games
            .splice(0, 4)
            .map(
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
                  className="h-full flex flex-col rounded-xl bg-base-100 rounded-tr-2xl rounded-tl-2xl"
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
      {/* Most owned deals */}

      {/* DLC deals */}
      <div>
        <Link
          href={"/deals/dlcs"}
          className="font-bold text-4xl w-fit hover:scale-105 transition-all delay-0 duration-300"
        >
          DLCs deals
        </Link>
        <Link
          href={"/deals/dlcs"}
          className="flex flex-row items-center gap-1 text-base-content/40 font-bold w-fit hover:scale-105 transition-all delay-0 duration-300"
        >
          <p>View all</p>
          <ChevronRight />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-4 rounded-2xl">
        {dlcsDeals &&
          dlcsDeals.games.length > 0 &&
          dlcsDeals.games.splice(0, 4).map(
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
                className="h-full flex flex-col rounded-xl bg-base-100 rounded-tr-2xl rounded-tl-2xl"
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
      {/* Most owned deals */}
    </div>
  );
}
