import axios from "axios";
import qs from "qs";

export const _PAYLOAD = {
    _method: "PUT",
    return_to: "/",
    platform_switch_2: false,
    games_filter_switch_2: "all",
    platform_switch: true, // ← IMPORTANT to enable main platform
    games_filter: "all",
    platform_ps5: false,
    games_filter_ps5: "all",
    platform_ps4: true,
    games_filter_ps4: "all",
    platform_xbox_series: false,
    games_filter_xbox_series: "all",
    platform_xbox_one: false,
    games_filter_xbox_one: "all",
    platform_steam: false,
    ps_plus: false,
    ps_plus_tier: "essential",
    ps_ea_play: false,
    gamepass_ultimate: false,
    gamepass_standard: false,
    gamepass_console: false,
    gamepass_pc: false,
    xbox_live_gold: false,
    xbox_ea_play: false,
    ubisoft_plus_multi_access: false,
};

const _SCRAPING_INSTANCE = axios.create({
    baseURL: "https://www.dekudeals.com",
    timeout: 10000,

});

export async function initializeSession(returnTo: string = "/") {
    try {
        const payload = { ..._PAYLOAD, return_to: returnTo };

        const response = await _SCRAPING_INSTANCE.post(
            "/platforms",
            qs.stringify(payload)
        );

        console.log("Initialized filter session:", response.status);
    } catch (err) {
        console.error("Failed to initialize session:", err);
        throw err;
    }
}


export default _SCRAPING_INSTANCE