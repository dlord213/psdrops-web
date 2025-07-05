"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

export default function Topbar() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-row items-center justify-between p-4 bg-base-100 relative border-b border-base-content/15">
      <div className="flex flex-row gap-4 items-center ">
        <label htmlFor="mobile-drawer" className="drawer-button lg:hidden ">
          <Menu />
        </label>

        <label className="relative input bg-base-300 rounded-3xl input-md md:input-lg border-none">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="hidden md:flex flex-row items-center gap-2"></div>
    </div>
  );
}
