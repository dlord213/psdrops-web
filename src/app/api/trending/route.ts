import _SCRAPING_INSTANCE from "@/app/utils/axios";
import * as cheerio from "cheerio";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const sort = searchParams.get("sort")
    const type = searchParams.get("type")
    const genre = searchParams.get("genre")

    try {

        const _URL = new URL(`/trending?page=${page}${sort ? `&sort=${sort}` : ""}${type ? `&filter[type]=${type}` : ""}${genre ? `&filter[genre]=${genre}` : ""}`, 'https://www.dekudeals.com');

        const { data } = await _SCRAPING_INSTANCE.get(_URL.toString())

        const $ = cheerio.load(data);

        const games: {
            productTitle: string;
            imgSrc: string | undefined;
            discount: string;
            price: string;
            originalPrice: string;
            link: string | undefined;
        }[] = [];

        $(".browse-cards > .row > .col").each((index, element) => {
            const $element = $(element);

            const productTitle = $element.find(".main-link h6").text().trim();
            const imgSrc = $element.find(".img-frame img").attr("src");
            const price = $element
                .find(".d-flex.align-items-center.text-tight strong")
                .text()
                .trim();
            const originalPrice = $element
                .find(".d-flex.align-items-center.text-tight s")
                .text()
                .trim();
            const discount = $element.find(".badge-danger").text().trim();
            const link = $element
                .find(".main-link")
                .attr("href")
                ?.replace("?", "&")
                .replace(/(eshop)(?=\w)/, "$1_").replace("/items/", "").replace("&platform=all", "")

            games.push({
                productTitle,
                imgSrc,
                discount,
                price,
                originalPrice,
                link,
            });
        });

        return Response.json({ status: 200, games })

    } catch (err) {
        return Response.json({ status: 400, message: "Error fetching deals.", errors: err })
    }
}