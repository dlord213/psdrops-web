/* eslint-disable @typescript-eslint/no-explicit-any */
import _SCRAPING_INSTANCE, { initializeSession } from "@/app/utils/axios";
import * as cheerio from "cheerio";

import { NextRequest } from "next/server";

interface Offer {
    store: string;
    url?: string;
    version: string;
    available: boolean;
    price: string | null;
    discountPercent: number | null;
    notes: string[];
}

interface RelatedItem {
    title: string;
    href: string;
    image: string;
    price: string;
    originalPrice?: string;
    discount?: string;
}

interface Recommendation {
    title: string;
    href: string;
    image: string;
    originalPrice: string | null;
    salePrice: string | null;
    discount: string | null;
    notes: string | null;
    saleEnds: string | null;
}

const extractRelatedItems = ($: any, id: string): RelatedItem[] => {
    const items: RelatedItem[] = [];

    $(`#${id} .related-item`).each((_: any, el: any) => {
        const $el = $(el);
        const title = $el.find(".main-link").text().trim();
        const href =
            $el.find(".main-link").attr("href").replace("/items/", "") || "";
        const image = $el.find("img").attr("src") || "";

        const priceEl = $el.find(".price");
        const originalPrice = priceEl.find("s").text().trim() || undefined;
        const currentPrice =
            priceEl.find("strong").text().trim() || priceEl.text().trim();
        const discount = priceEl.find(".badge-danger").text().trim() || undefined;

        items.push({
            title,
            href,
            image,
            price: currentPrice,
            ...(originalPrice && { originalPrice }),
            ...(discount && { discount }),
        });
    });

    return items;
};

const getDetails = async (slug: string) => {
    try {
        await initializeSession(slug);
        const { data } = await _SCRAPING_INSTANCE.get(`/items/${slug}`);
        const $ = cheerio.load(data);

        const gameDetails: Record<string, any> = {};

        // 📷 Main Image
        gameDetails.image = $(".responsive-img").attr("src") || null;
        gameDetails.title = $(".item-title").text()

        // 📋 Game Info (Left Panel)
        $(".details .list-group-item").each((_, el) => {
            const $el = $(el);
            let label = $el.find("strong").first().text().trim();

            // Support for linked label text (e.g. "How Long To Beat" as a link)
            if (!label.endsWith(":")) {
                label = $el.find("strong a").first().text().trim() + ":";
            }

            switch (label) {
                case "MSRP:":
                    gameDetails.msrp = $el.text().replace(label, "").trim();
                    break;

                case "Release date:":
                    const dateList = $el.find("ul li");
                    gameDetails.releaseDates = {};

                    if (dateList.length > 0) {
                        dateList.each((_, li) => {
                            const platform = $(li).find("strong").text().trim();
                            const date = $(li)
                                .contents()
                                .filter((_, el) => el.type === "text")
                                .text()
                                .trim();
                            gameDetails.releaseDates[platform] = date;
                        });
                    } else {
                        gameDetails.releaseDates["default"] = $el.text().replace(label, "").trim();
                    }
                    break;

                case "Genre:":
                    gameDetails.genre = $el.find("a").map((_, a) => {
                        const genre = $(a).text().trim();
                        const href = $(a)
                            .attr("href")
                            ?.replace("/games", "/deals")
                            .replace("filter[genre]", "genre");
                        return { genre, href };
                    }).get();
                    break;

                case "Number of players:":
                    gameDetails.players = {};
                    $el.find("ul li").each((_, li) => {
                        const type = $(li).find("strong").text().replace(":", "").trim().toLowerCase();
                        const count = $(li).text().replace(/(Offline|Online):/, "").trim();
                        gameDetails.players[type] = count;
                    });
                    break;

                case "Developer:":
                    gameDetails.developer = $el.find("a").text().trim();
                    break;

                case "Publisher:":
                    gameDetails.publisher = $el.find("a").text().trim();
                    break;

                case "Metacritic:":
                    gameDetails.metacritic = {
                        score: $el.find("span.bg-success").text().trim(),
                        user: $el.find("span.text-success").text().trim(),
                        url: $el.find("a").attr("href"),
                    };
                    break;

                case "OpenCritic:":
                    gameDetails.opencritic = {
                        score: $el.text().replace(/[^0-9]/g, ""),
                        url: $el.find("a").attr("href"),
                        rating: $el.find("a").attr("title") || null,
                    };
                    break;

                case "How Long To Beat:":
                    gameDetails.hltb = {};
                    const hltbLink = $el.find("strong a").attr("href");
                    if (hltbLink) {
                        gameDetails.hltb.url = hltbLink;
                    }
                    $el.find("ul li").each((_, li) => {
                        const mode = $(li).find("strong").text().replace(":", "").trim();
                        const time = $(li).text().replace(`${mode}:`, "").trim();
                        gameDetails.hltb[mode] = time;
                    });
                    break;

                case "ESRB Rating:":
                    gameDetails.esrb = $el.text().replace(label, "").trim();
                    break;
                case "Platforms:":
                    const platformsText = $el.find("a").text().trim() || $el.clone().children("strong").remove().end().text().trim();
                    gameDetails.platforms = platformsText
                        .split(",")
                        .map((p) => p.trim())
                        .filter(Boolean);
                    break;

                default: {
                    // Remove <strong> tag to get raw value
                    const keyRaw = $el.find("strong").first().text().trim().replace(":", "");

                    // Normalize key: to camelCase
                    const normalizedKey = keyRaw
                        .toLowerCase()
                        .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

                    // Remove the label and keep the value text
                    const valueText = $el.clone().children("strong").remove().end().text().trim();

                    if (valueText) {
                        gameDetails[normalizedKey] = valueText;
                    }

                    break;
                }
            }
        });


        // 🛒 Offers Table (Right Panel)
        const offers: Offer[] = [];
        $("tr.item-table-best, tr.has-notes").each((_, row) => {
            const storeEl = $(row).find("td .logo").parent("a");
            const storeUrl = storeEl.attr("href")?.replace("/items/", "");
            const storeClass = $(row).find("td .logo").attr("class") || "";
            const storeName =
                storeClass.match(/logo\s+(\w+)/)?.[1].replace(/_/g, ".") || "Unknown";

            const version = $(row).find("td.version div").text().trim();
            const priceText = $(row).find("td").last().text().trim();
            const isUnavailable = priceText.includes("Unavailable");
            const price = priceText.match(/\$\d+(\.\d{2})?/)?.[0] ?? null;
            const discount = $(row)
                .find(".badge")
                .text()
                .match(/-(\d+)%/)?.[1];

            offers.push({
                store: storeName,
                url: storeUrl,
                version,
                available: !isUnavailable,
                price,
                discountPercent: discount ? parseInt(discount) : null,
                notes: [],
            });
        });

        // Attach notes to previous offers
        let offerIndex = 0;
        $("tr").each((_, row) => {
            const $row = $(row);
            if ($row.hasClass("item-note")) {
                offers[offerIndex]?.notes.push($row.text().trim());
            } else if (
                $row.hasClass("item-table-best") ||
                $row.hasClass("has-notes")
            ) {
                offerIndex++;
            }
        });
        // 🛒 Offers Table (Right Panel)

        // 📝 Description
        const descriptionEl = $("#descriptionCollapse .description").clone();
        descriptionEl.find("*").each((_, el) => {
            if (!$(el).text().trim()) $(el).remove();
        });

        // 🖼️ Screenshots
        const screenshots = new Set<string>();
        $("#screenshotsCollapse img").each((_, el) => {
            const src = $(el).attr("data-src") || $(el).attr("src");
            if (src?.startsWith("http")) screenshots.add(src);
        });

        // 🎁 DLCs and Editions
        const dlcs = extractRelatedItems($, "dlcCollapse");
        const included = extractRelatedItems($, "included-inCollapse");
        const recommendations: Recommendation[] = [];

        $(".row.item-grid2 .cell").each((_, el) => {
            const element = $(el);

            const link = element.find("a.main-link").attr("href")?.replace("/items/", "") || "";
            const image = element.find("img.responsive-img").attr("src") || "";
            const title = element.find(".h6.name").text().trim()

            const originalPrice =
                element.find(".card-badge s.text-muted").text().trim() || null;
            const salePrice =
                element.find(".card-badge strong").text().trim() || null;
            const discount =
                element.find(".card-badge .badge-danger").text().trim() || null;

            const notes =
                element.find(".card-badge .badge-warning").text().trim() || null;

            const saleEndText = element.find("small").text().trim();
            const saleEnds = saleEndText.includes("Sale ends")
                ? saleEndText.replace("Sale ends ", "")
                : null;

            recommendations.push({
                title,
                href: link,
                image,
                originalPrice,
                salePrice,
                discount,
                notes,
                saleEnds,
            });
        });

        return {
            ...gameDetails,
            offers,
            images: Array.from(screenshots),
            description: descriptionEl.html()?.trim() ?? "",
            dlcs,
            included,
            recommendations,
        };
    } catch (error) {
        throw new Error(
            `Failed to fetch game details: ${(error as Error).message}`
        );
    }
};

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ game: string }> }
) {
    const { game } = await params;

    try {
        const gameData = await getDetails(game);
        return Response.json({ status: 200, game: gameData });
    } catch (err) {
        return Response.json({
            status: 500,
            message: "Error fetching game details.",
            error: (err as Error).message,
        });
    }
}
