import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import Card from "@/app/components/Card/Card";
import Tooltip from "@/app/components/Tooltip";
import AmmoProgress from "@/app/components/AmmoChart";
// import SortButton from "@/app/components/SortButton";
// import useInfiniteScroll from "@/app/hooks/useInfiniteScroll";
import { useToggle } from "@/app/hooks/useToggle";
import QuestionIcon from "@/app/components/Icons/QuestionIcon";
import { ILeaderBoardData } from "@/app/types";

const LeaderBoard = () => {
  const [loading, { toggleOn: toggleOnLoading, toggleOff: toggleOffLoading }] =
    useToggle(false);
  const [data, setData] = useState<ILeaderBoardData | null>(null);
  // const [sortData, setSortData] = useState<{
  //   column: string;
  //   direction: "asc" | "desc" | "none";
  // }>({
  //   column: "",
  //   direction: "none",
  // });

  // // Handler for sorting
  // const handleSort = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
  //   const column = e.currentTarget.dataset.column;

  //   // column info is necessary
  //   if (!column) return;

  //   setSortData((cur) => {
  //     if (cur.column === column) {
  //       return {
  //         column,
  //         direction: cur.direction === "asc" ? "desc" : "asc",
  //       };
  //     }
  //     return { column, direction: "asc" };
  //   });

  //   // // TODO: Integrate with backend to fetch data with sort info
  //   // setData(MOCK_DATA); // Reset data with mock data
  // }, []);

  // Handler for load more
  // const handleLoadMore = useCallback(() => {
  //   // TODO: Integrate with backend for loading more data
  //   toggleOnLoading();
  //   setTimeout(() => {
  //     setData((cur) => [...cur, ...MOCK_DATA]);
  //     toggleOffLoading();
  //   }, 2000);
  // }, [toggleOffLoading, toggleOnLoading]);

  // const targetRef = useInfiniteScroll(handleLoadMore);

  const fetchLeaderboardData = useCallback(async () => {
    toggleOnLoading();

    const leaderboardResp = await fetch("/api/azure-sass/leaderboard", {
      headers: {
        cache: "no-cache",
      },
    });
    if (leaderboardResp.ok) {
      const { data } = await leaderboardResp.json();

      if (!data) {
        console.error("Failed to fetch leaderboard data");
        return;
      }

      setData(data as ILeaderBoardData);
      toggleOffLoading();
    } else {
      console.error("Failed to fetch leaderboard data");
    }
  }, [toggleOffLoading, toggleOnLoading]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  return (
    <Card
      contentClassName="flex flex-col !p-0 !h-[750px]"
      className="max-h-[90vh]"
      title="My Gardeners"
    >
      <div className="relative w-full h-0 flex-grow px-4 overflow-auto [clip-path:inset(0_16px_round_0)]">
        <table className="w-full min-w-[900px] table-fixed overflow-x-auto font-bold border-collapse">
          <thead className="sticky top-0 bg-primary z-10">
            <tr className="text-left h-11">
              <th className="w-[15%] sticky left-0 bg-primary pl-4 z-10">
                <div className="flex items-center gap-1">
                  User
                  {/* <SortButton
                    direction={
                      sortData.column === "user" ? sortData.direction : "none"
                    }
                    data-column="user"
                    onClick={handleSort}
                  /> */}
                </div>
              </th>
              <th className="w-[12%] text-center">
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="The number of Mentions and therefore memories saved by Plant in its Relationship database">
                    <div className="flex gap-1 items-center">
                      Mentions <QuestionIcon />
                    </div>
                  </Tooltip>
                  {/* <SortButton
                    direction={
                      sortData.column === "mentions"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="mentions"
                    onClick={handleSort}
                  /> */}
                </div>
              </th>
              <th className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="The total engagement (Replies, Retweets, Likes, Views) on your mentions with Plant">
                    <div className="flex gap-1 items-center">
                      Engagement <QuestionIcon />
                    </div>
                  </Tooltip>
                  {/* <SortButton
                    direction={
                      sortData.column === "engagement"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="engagement"
                    onClick={handleSort}
                  /> */}
                </div>
              </th>
              <th className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="Relevance of your Mention with Plant on X. It should be related to tokens or wallets or crypto projects.">
                    <div className="flex gap-1 items-center">
                      Relevance <QuestionIcon />
                    </div>
                  </Tooltip>
                  {/* <SortButton
                    direction={
                      sortData.column === "relevance"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="relevance"
                    onClick={handleSort}
                  /> */}
                </div>
              </th>
              <th className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="Depth in your Mention with Plant on X. The more information and words the more it learns.">
                    <div className="flex gap-1 items-center">
                      Depth <QuestionIcon />
                    </div>
                  </Tooltip>
                  {/* <SortButton
                    direction={
                      sortData.column === "depth" ? sortData.direction : "none"
                    }
                    data-column="depth"
                    onClick={handleSort}
                  /> */}
                </div>
              </th>
              <th className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="Novelty in your Mentions with Plant on X. New tokens and projects are valued more. Tokens that have never been mentioned before.">
                    <div className="flex gap-1 items-center">
                      Novelty <QuestionIcon />
                    </div>
                  </Tooltip>
                  {/* <SortButton
                    direction={
                      sortData.column === "novelty"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="novelty"
                    onClick={handleSort}
                  /> */}
                </div>
              </th>
              <th className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="Sentiment in your mentions with Plant on X. Positive sentiment is valued more.">
                    <div className="flex gap-1 items-center">
                      Sentiment <QuestionIcon />
                    </div>
                  </Tooltip>
                  {/* <SortButton
                    direction={
                      sortData.column === "sentiment"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="sentiment"
                    onClick={handleSort}
                  /> */}
                </div>
              </th>
              <th>
                <div className="flex items-center justify-center gap-1">
                  Score
                  {/* <SortButton
                    direction={
                      sortData.column === "score" ? sortData.direction : "none"
                    }
                    data-column="score"
                    onClick={handleSort}
                  /> */}
                </div>
              </th>
              <th className="w-[50px]" />
            </tr>
          </thead>
          <tbody>
            {(data?.items || []).map(({ persona, twitterRank }, i) => (
              <tr
                key={`ranking-${i}`}
                className={clsx("h-9", i % 2 === 0 && "bg-[#decca2]")}
              >
                <td
                  className={clsx(
                    "sticky left-0 pl-4",
                    i % 2 === 0 ? "bg-[#decca2]" : "bg-primary",
                  )}
                >
                  <div className="flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={persona.twitterAvatarUrl}
                      className="w-5 h-5 object-cover rounded-full mr-2"
                      width={128}
                      height={128}
                      alt=""
                    />
                    <div className="flex w-0 flex-grow items-center">
                      <Link
                        className="underline truncate"
                        href={`https://x.com/${persona.twitterHandle.slice(1)}`}
                        target="_blank"
                      >
                        {persona.name}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="text-center">{twitterRank.totalMentions}</td>
                <td>
                  <AmmoProgress
                    id="engagement"
                    value={twitterRank.totalEngagementScore}
                  />
                </td>
                <td>
                  <AmmoProgress
                    id="relevance"
                    value={twitterRank.totalRelevanceScore}
                    color="bg-[#FFC107]"
                  />
                </td>
                <td>
                  <AmmoProgress
                    id="depth"
                    value={twitterRank.totalDepthScore}
                    color="bg-[#8B5A2B]"
                  />
                </td>
                <td>
                  <AmmoProgress
                    id="novelty"
                    value={twitterRank.totalNoveltyScore}
                    color="bg-[#4E944F]"
                  />
                </td>
                <td>
                  <AmmoProgress
                    id="sentiment"
                    value={twitterRank.totalSentimentScore}
                    color="bg-[#F58634]"
                  />
                </td>
                <td className="text-center">{twitterRank.totalScore}</td>
                <td>
                  {twitterRank.rank < 20
                    ? "🌱"
                    : twitterRank.rank < 40
                      ? "🪴"
                      : twitterRank.rank < 60
                        ? "☀️"
                        : twitterRank.rank < 80
                          ? "🌸"
                          : "👑"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Target element for infinite scroll */}
        {loading ? (
          <p className="text-center">Loading more...</p>
        ) : (
          <div className="h-[1px]" />
        )}
      </div>
      <div className="flex justify-between gap-2 items-center px-9 h-8 font-bold text-[10px] overflow-x-auto hidden-scrollbar bg-[#decca2] border-t-2 border-t-black">
        <Tooltip
          content="Entry Level: New members who’ve just started contributing. They plant the seeds of engagement by mentioning the plant occasionally. Requirements: Minimal contributions like basic mentions or interactions."
          placement="bottom"
        >
          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
            <span className="text-xs">🌱 (0 - 20%)</span>
            <span>Seed Planters</span>
            <QuestionIcon />
          </div>
        </Tooltip>
        <Tooltip
          content="Intermediate Level: Members who consistently provide relevant and thoughtful mentions, helping the plant grow strong roots. Requirements: Regular participation with more relevant and deeper mentions."
          placement="bottom"
        >
          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
            <span className="text-xs">🪴 (20 - 40%)</span>
            <span>Soil Tenders</span>
            <QuestionIcon />
          </div>
        </Tooltip>
        <Tooltip
          content="Advanced Level: Highly active members whose mentions are consistently engaging, positive, and insightful, acting as the plant's main source of growth. Requirements: High-quality mentions, positive sentiment, and creative contributions."
          placement="bottom"
        >
          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
            <span className="text-xs">☀️ (40 - 60%)</span>
            <span>Sunlight Bringers</span>
            <QuestionIcon />
          </div>
        </Tooltip>
        <Tooltip
          content="Expert Level: Top-tier contributors who bring novelty, enthusiasm, and drive engagement across the community, making the plant thrive. Requirements: Exceptional engagement, introducing novel ideas, and driving significant community activity."
          placement="bottom"
        >
          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
            <span className="text-xs">🌸 (60 - 80%)</span>
            <span>Blossom Cultivators</span>
            <QuestionIcon />
          </div>
        </Tooltip>
        <Tooltip
          content="Elite Level: The most dedicated and impactful members who consistently lead the community, provide key insights, and help others contribute. They are the ultimate nurturers of the plant’s growth. Requirements: Leadership in engagement, top-quality contributions, and recognition as community role models."
          placement="bottom"
        >
          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
            <span className="text-xs">👑 (80 - 100%)</span>
            <span>Master Gardeners</span>
            <QuestionIcon />
          </div>
        </Tooltip>
      </div>
    </Card>
  );
};

export default LeaderBoard;
