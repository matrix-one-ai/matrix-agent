"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import useHoverSupport from "@/app/hooks/useHoverSupport";

const FeedMeButton = () => {
  const supportsHover = useHoverSupport();

  return (
    <Link
      href="https://twitter.com/intent/tweet?screen_name=x&ref_src=twsrc%5Etfw"
      className={clsx(
        "flex justify-center items-center gap-2 bg-secondary w-72 h-16 rounded-[50px] text-black border-black border-2 font-bold text-2xl group",
        supportsHover &&
          "hover:border-[#19B0FE] hover:shadow-[inset_0_4px_5px_rgba(0,0,0,0.5)]",
      )}
      target="_blank"
    >
      <span className={clsx(supportsHover && "invisible group-hover:visible")}>
        💦
      </span>
      Feed Me Mentions
      <span className={clsx(supportsHover && "invisible group-hover:visible")}>
        💦
      </span>
    </Link>
  );
};

export default FeedMeButton;
