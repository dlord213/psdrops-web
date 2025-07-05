/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";

import { Building, ShoppingBag, User } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

const DeveloperSection = ({
  game,
}: {
  game: { developer: string[] | string };
}) => {
  if (Array.isArray(game)) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <User />
          <p>Developer/s</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {game.developer.map((dev) => (
            <p
              className="px-6 py-1 bg-base-100 rounded-3xl text-sm"
              key={dev.link}
            >
              {dev.name}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <User />
        <p>Developer/s</p>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <p className="px-6 py-1 bg-base-100 rounded-3xl text-sm">
          {game.developer}
        </p>
      </div>
    </div>
  );
};

const PublisherSection = ({
  game,
}: {
  game: { publisher: string[] | string };
}) => {
  if (Array.isArray(game)) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <User />
          <p>Publisher/s</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {game.publisher.map((dev) => (
            <p
              className="px-6 py-1 bg-base-100 rounded-3xl text-sm"
              key={dev.link}
            >
              {dev.name}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <User />
        <p>Publisher/s</p>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <p className="px-6 py-1 bg-base-100 rounded-3xl text-sm">
          {game.publisher}
        </p>
      </div>
    </div>
  );
};

const GenreSection = ({ game }: { game: { genre: string[] } }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-base-content/40">Genres</p>
      <div className="flex flex-row gap-2 items-center flex-wrap">
        {game.genre.map((genre) => (
          <Link
            href={genre.href}
            className="px-6 py-1 bg-base-100 rounded-3xl"
            key={genre.href}
          >
            {genre.genre}
          </Link>
        ))}
      </div>
    </div>
  );
};

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ game: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { game } = await params;
  const res = await fetch(`http://localhost:3000/api/game/${game}`);
  const data = await res.json();

  const title = data.game.title ?? "Unknown Game";
  const description =
    data.game.description?.replace(/\n+/g, " ").trim() ??
    "Discover and play the most exciting indie games!";
  const canonicalUrl = `https://psdrops.com/game/${game}`;

  const images = Array.isArray(data.game.images)
    ? data.game.images.slice(0, 6)
    : [];

  return {
    title: `PSDrops / ${title}`,
    description,
    keywords: [title],
    metadataBase: new URL("https://psdrops.com"),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Play ${title} | PSDrops`,
      description,
      url: canonicalUrl,
      images: images.map((url) => ({
        url,
        width: 1200,
        height: 630,
        alt: `${title} screenshot`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `Play ${title} | PSDrops`,
      description,
      images,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;
  const data = await (
    await fetch(`http://localhost:3000/api/game/${game}`)
  ).json();

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-[0.5fr_1fr] 2xl:grid-cols-[0.4fr_1fr] gap-6 p-8 overflow-y-scroll min-h-screen bg-base-300 lg:min-h-[86vh] lg:max-h-[86vh] xl:min-h-[88vh] xl:max-h-[88vh] 2xl:min-h-[90vh] 2xl:max-h-[90vh] max-w-7xl mx-auto relative">
      <div className="flex flex-col md:flex-row xl:flex-col gap-8 xl:gap-4 px-2 xl:h-full xl:sticky xl:top-4 xl:overflow-y-auto">
        <div className="flex flex-col gap-4">
          <img
            src={data.game.image}
            className="max-h-[30rem] rounded-3xl self-start object-contain"
          />
          <h1 className="font-bold text-4xl">{data.game.title}</h1>
        </div>
        <div className="flex flex-col gap-4">
          <DeveloperSection game={data.game} />
          <PublisherSection game={data.game} />
          <GenreSection game={data.game} />
        </div>

        {data.game.Platforms && data.game.Platforms > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-base-content/40">Platforms</p>
            <div className="flex flex-row gap-2 items-center flex-wrap">
              <p>{data.game.Platforms[0].name}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 xl:overflow-y-scroll">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold tracking-widest text-base-content/40">
            DESCRIPTION
          </h1>
          <p
            className="text-lg"
            dangerouslySetInnerHTML={{
              __html: data.game.description.replace(/\n/g, "<br />"),
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
            <input type="checkbox" />
            <div className="collapse-title font-semibold">
              <h1 className="font-bold tracking-widest text-base-content/40">
                SCREENSHOTS
              </h1>
            </div>
            <div className="collapse-content flex flex-col gap-4">
              <div className="carousel w-full">
                {data.game.images.map((image, index) => {
                  const totalSlides = data.game.images.length;
                  const prevIndex = (index - 1 + totalSlides) % totalSlides;
                  const nextIndex = (index + 1) % totalSlides;

                  return (
                    <div
                      key={image}
                      id={`slide${index + 1}`}
                      className="carousel-item relative w-full"
                    >
                      <img src={image} className="w-full rounded-3xl" />
                      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a
                          href={`#slide${prevIndex + 1}`}
                          className="btn btn-circle"
                        >
                          ❮
                        </a>
                        <a
                          href={`#slide${nextIndex + 1}`}
                          className="btn btn-circle"
                        >
                          ❯
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
            <input type="checkbox" />
            <div className="collapse-title font-semibold">
              <h1 className="font-bold tracking-widest text-base-content/40">
                DLCS
              </h1>
            </div>
            <div className="collapse-content grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.game.dlcs.map((game) => (
                <Link
                  href={`/game/${game.href}`}
                  className="flex flex-col gap-2 transition-all delay-0 duration-300 hover:scale-105"
                  key={game.href}
                >
                  <img
                    className="aspect-square object-cover w-full rounded-3xl"
                    src={game.image}
                  />
                  <p>{game.title}</p>
                  {game.price != "Unavailable" && (
                    <p className="font-bold">{game.price}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
            <input type="checkbox" />
            <div className="collapse-title font-semibold">
              <h1 className="font-bold tracking-widest text-base-content/40">
                RECOMMENDATIONS
              </h1>
            </div>
            <div className="collapse-content grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.game.recommendations.map((game) => (
                <Link
                  href={`/game/${game.href}`}
                  className="flex flex-col gap-2 transition-all delay-0 duration-300 hover:scale-105"
                  key={game.href}
                >
                  <img
                    className="aspect-square object-cover w-full rounded-3xl"
                    src={game.image}
                  />
                  <p>{game.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
