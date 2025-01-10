import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Card from "@/app/components/Card/Card";
import RetweetIcon from "@/app/components/Icons/RetweetIcon";
import EyeIcon from "@/app/components/Icons/EyeIcon";
import { useToggle } from "@/app/hooks/useToggle";
import { LB_PLACEHOLDER_AVATAR_SRC } from "@/app/constants";
import { AbortableFetch } from "@/app/utils/abortablePromise";
import { formatLocalDate } from "@/app/utils/string";
import { ILatestTweetsData } from "@/app/types";

const LatestTweets = () => {
  const [loading, { toggleOn: toggleOnLoading, toggleOff: toggleOffLoading }] =
    useToggle(true);
  const [data, setData] = useState<ILatestTweetsData | null>(null);
  const abortableLTFetchRef = useRef<AbortableFetch | null>(null);

  // Fetch latest tweets
  const fetchLatestTweetsData = useCallback(async () => {
    try {
      abortableLTFetchRef.current?.abort();

      toggleOnLoading();

      abortableLTFetchRef.current = new AbortableFetch(
        "/api/azure-sass/latest-tweets",
        {
          headers: {
            cache: "no-cache",
          },
        },
      );
      const latestTweetsResp = await abortableLTFetchRef.current.fetch;
      abortableLTFetchRef.current = null;
      if (latestTweetsResp.ok) {
        const { data } = await latestTweetsResp.json();

        if (!data) {
          throw new Error(
            "LatestTweets data is not available. Please try again later.",
          );
        }

        setData(data as ILatestTweetsData);
        toggleOffLoading();
      } else {
        throw new Error(latestTweetsResp.statusText);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Fetch aborted.");
      } else {
        console.error("Fetch failed:", error);
      }
    }
  }, [toggleOffLoading, toggleOnLoading]);

  useEffect(() => {
    fetchLatestTweetsData();
  }, [fetchLatestTweetsData]);

  // Handler for opening tweet
  const handleFeedClick = useCallback((tweetUrl: string) => {
    window.open(tweetUrl, "_blank");
  }, []);

  // Handler when clicking on tweet poster
  const handleFeedPosterClick = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      e.stopPropagation(); // Prevent opening post link
    },
    [],
  );

  return (
    <Card
      contentClassName="flex flex-col !p-0 cursor-default"
      title="My Sprouting Feed"
    >
      <div className="relative w-full h-[60vh] md:h-[450px] flex-grow overflow-auto grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-sm">
        {(data?.items || []).map(
          (
            {
              name,
              avatarUrl,
              handle,
              retweets,
              tweetDate,
              tweetText,
              tweetUrl,
              views,
            },
            index,
          ) => (
            <button
              key={`twitter-feed-${index}`}
              className="flex flex-col text-left p-2 gap-2 border border-black rounded-[10px]"
              onClick={() => handleFeedClick(tweetUrl)}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl || LB_PLACEHOLDER_AVATAR_SRC}
                    className="w-5 h-5 object-cover rounded-full mr-2"
                    width={128}
                    height={128}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = LB_PLACEHOLDER_AVATAR_SRC;
                    }}
                    alt=""
                  />
                  <Link
                    className="underline truncate font-bold"
                    href={`https://x.com/${handle.slice(1)}`}
                    target="_blank"
                    onClick={handleFeedPosterClick}
                  >
                    {name}
                  </Link>
                </div>
                <span>{formatLocalDate(tweetDate)}</span>
              </div>
              <p className="line-clamp-3">{tweetText}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center gap-1">
                  <RetweetIcon /> {retweets}
                </div>
                <div className="flex items-center gap-1">
                  <EyeIcon /> {views}
                </div>
              </div>
            </button>
          ),
        )}
        {loading && (
          <p className="text-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-bold">
            Loading...
          </p>
        )}
      </div>
      <Link
        className="underline text-base font-bold text-center mt-1 mb-3 md:mt-3 md:mb-9"
        href="https://x.com/plantdotfun"
        target="_blank"
      >
        Plants X Feed
      </Link>
    </Card>
  );
};

export default LatestTweets;
