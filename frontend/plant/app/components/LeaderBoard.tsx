import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import Card from "@/app/components/Card/Card";
import Tooltip from "@/app/components/Tooltip";
import AmmoProgress from "@/app/components/AmmoChart";
import Dropdown from "@/app/components/Dropdown";
// import SortButton from "@/app/components/SortButton";
// import useInfiniteScroll from "@/app/hooks/useInfiniteScroll";
import { useToggle } from "@/app/hooks/useToggle";
import QuestionIcon from "@/app/components/Icons/QuestionIcon";
import LeftChevronIcon from "@/app/components/Icons/LeftChevronIcon";
import RightChevronIcon from "@/app/components/Icons/RightChevronIcon";
import {
  ILeaderBoardData,
  // TLeaderBoardDataItem,
  // TSortDirection,
  ELeaderBoardPageSize,
} from "@/app/types";
import {
  BLOCK_USER_NAMES,
  LB_PLACEHOLDER_AVATAR_SRC,
  LB_PAGE_COUNT_LIMIT,
} from "@/app/constants";
import { AbortableFetch } from "@/app/utils/abortablePromise";
// import { sortObjectArray } from "@/app/utils/array";

const LeaderBoard = () => {
  const [loading, { toggleOn: toggleOnLoading, toggleOff: toggleOffLoading }] =
    useToggle(false);
  const [data, setData] = useState<ILeaderBoardData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(ELeaderBoardPageSize.TWENTY);
  // const [sortData, setSortData] = useState<{
  //   column: string;
  //   direction: TSortDirection;
  // }>({
  //   column: "",
  //   direction: "none",
  // });
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);
  const abortableLBFetchRef = useRef<AbortableFetch | null>(null);

  // // Handler for sorting
  // const handleSort = useCallback(
  //   (e: React.MouseEvent<HTMLButtonElement>) => {
  //     const column = e.currentTarget.dataset.column as
  //       | keyof TLeaderBoardDataItem
  //       | undefined;

  //     // column info is necessary
  //     if (!column || data === null) return;

  //     let sortDirection: TSortDirection = "asc";
  //     if (sortData.column === column) {
  //       // Toggle direction
  //       sortDirection = sortData.direction === "asc" ? "desc" : "asc";
  //     }

  //     setSortData({ column, direction: sortDirection });

  //     const items = sortObjectArray(data.items, column, sortDirection);
  //     console.log(items);
  //     setData({ ...data, items });
  //   },
  //   [data, sortData],
  // );

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
    try {
      abortableLBFetchRef.current?.abort();

      toggleOnLoading();

      abortableLBFetchRef.current = new AbortableFetch(
        `/api/azure-sass/leaderboard?page=${page}&pagesize=${pageSize}`,
        {
          headers: {
            cache: "no-cache",
          },
        },
      );
      const leaderboardResp = await abortableLBFetchRef.current.fetch;
      abortableLBFetchRef.current = null;
      if (leaderboardResp.ok) {
        const { data } = await leaderboardResp.json();

        if (!data) {
          throw new Error(
            "Leaderboard data is not available. Please try again later.",
          );
        }

        setData(data as ILeaderBoardData);
        toggleOffLoading();

        tableWrapperRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error(leaderboardResp.statusText);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Fetch aborted.");
      } else {
        console.error("Fetch failed:", error);
      }
    }
  }, [toggleOffLoading, toggleOnLoading, page, pageSize]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Get min and max score
  const [minScore, maxScore] = useMemo(() => {
    if (data === null) return [1, 1];

    const scores = data.items.map((item) => item.twitterRank.totalScore);
    return [Math.min(...scores), Math.max(...scores)];
  }, [data]);

  // Get max page number
  const maxPage = useMemo(
    () => Math.ceil((data?.totalCount || 0) / pageSize),
    [pageSize, data],
  );

  // Get visible page numbers
  const visiblePageNumbers = useMemo(() => {
    if (maxPage <= LB_PAGE_COUNT_LIMIT)
      return Array.from({ length: maxPage }, (_, i) => i + 1);

    const startPage =
      Math.floor((page - 1) / LB_PAGE_COUNT_LIMIT) * LB_PAGE_COUNT_LIMIT + 1;
    const endPage = startPage + 4;

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }, [page, maxPage]);

  // Handler for changing count per page
  const handleCountPerPageChange = useCallback((value: string | number) => {
    setPageSize(Number(value));
  }, []);

  // Handler for changing page
  const handleGoToPage = useCallback((page: number) => {
    setPage(page);
  }, []);

  // // Handler for changing page to next LB_PAGE_COUNT_LIMIT
  // const handleGoToNextPages = useCallback(() => {
  //   if (visiblePageNumbers[visiblePageNumbers.length - 1] < maxPage) {
  //     setPage((cur) => cur + LB_PAGE_COUNT_LIMIT);
  //   }
  // }, [visiblePageNumbers, maxPage]);

  // Handler for changing page to next one
  const handleGoToNextPage = useCallback(() => {
    setPage((cur) => (cur === maxPage ? maxPage : cur + 1));
  }, [maxPage]);

  // Handler for changing page to previous one
  const handleGoToPrevPage = useCallback(() => {
    setPage((cur) => (cur === 1 ? 1 : cur - 1));
  }, []);

  return (
    <Card
      contentClassName="flex flex-col !p-0 !h-[750px]"
      className="max-h-[90vh]"
      title="My Gardeners"
    >
      <div
        ref={tableWrapperRef}
        className="relative w-full h-0 flex-grow px-4 overflow-auto [clip-path:inset(0_16px_round_0)]"
      >
        <table
          className={clsx(
            "w-full min-w-[900px] table-fixed overflow-x-auto font-bold border-collapse",
            loading && "animate-pulse animate-duration-[1500ms]",
          )}
        >
          <thead className="sticky top-0 bg-primary z-10">
            <tr className="text-left h-11">
              <th className="w-[15%] sticky left-0 bg-primary pl-4 z-10">
                <div className="flex items-center gap-1">
                  User
                  {/* <SortButton
                    direction={
                      sortData.column === "persona.name"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="persona.name"
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
                      sortData.column === "twitterRank.totalMentions"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="twitterRank.totalMentions"
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
                      sortData.column === "twitterRank.totalEngagementScore"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="twitterRank.totalEngagementScore"
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
                      sortData.column === "twitterRank.totalRelevanceScore"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="twitterRank.totalRelevanceScore"
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
                      sortData.column === "twitterRank.totalDepthScore"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="twitterRank.totalDepthScore"
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
                      sortData.column === "twitterRank.totalNoveltyScore"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="twitterRank.totalNoveltyScore"
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
                      sortData.column === "twitterRank.totalSentimentScore"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="twitterRank.totalSentimentScore"
                    onClick={handleSort}
                  /> */}
                </div>
              </th>
              <th>
                <div className="flex items-center justify-center gap-1">
                  Score
                  {/* <SortButton
                    direction={
                      sortData.column === "twitterRank.totalScore"
                        ? sortData.direction
                        : "none"
                    }
                    data-column="twitterRank.totalScore"
                    onClick={handleSort}
                  /> */}
                </div>
              </th>
              <th className="w-[50px]" />
            </tr>
          </thead>
          <tbody>
            {(data?.items || [])
              .filter(({ persona }) => !BLOCK_USER_NAMES.includes(persona.name))
              .map(({ id, persona, twitterRank }, i) => {
                const { twitterAvatarUrl, twitterHandle, name } = persona;
                const {
                  totalMentions,
                  totalEngagementScore,
                  totalRelevanceScore,
                  totalDepthScore,
                  totalNoveltyScore,
                  totalSentimentScore,
                  totalScore,
                } = twitterRank;
                const scorePercentage =
                  ((totalScore - minScore) / (maxScore - minScore)) * 100;

                return (
                  <tr
                    key={id}
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
                          src={twitterAvatarUrl || LB_PLACEHOLDER_AVATAR_SRC}
                          className="w-5 h-5 object-cover rounded-full mr-2"
                          width={128}
                          height={128}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = LB_PLACEHOLDER_AVATAR_SRC;
                          }}
                          alt=""
                        />
                        <div className="flex w-0 flex-grow items-center">
                          <Link
                            className="underline truncate"
                            href={`https://x.com/${twitterHandle.slice(1)}`}
                            target="_blank"
                          >
                            {name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{totalMentions}</td>
                    <td>
                      <AmmoProgress
                        id="engagement"
                        value={totalEngagementScore}
                      />
                    </td>
                    <td>
                      <AmmoProgress
                        id="relevance"
                        value={totalRelevanceScore}
                        color="bg-[#FFC107]"
                      />
                    </td>
                    <td>
                      <AmmoProgress
                        id="depth"
                        value={totalDepthScore}
                        color="bg-[#8B5A2B]"
                      />
                    </td>
                    <td>
                      <AmmoProgress
                        id="novelty"
                        value={totalNoveltyScore}
                        color="bg-[#4E944F]"
                      />
                    </td>
                    <td>
                      <AmmoProgress
                        id="sentiment"
                        value={totalSentimentScore}
                        color="bg-[#F58634]"
                      />
                    </td>
                    <td className="text-center">{totalScore}</td>
                    <td>
                      {scorePercentage < 20 ? (
                        <Image
                          src="/images/level_1.png"
                          width={16}
                          height={16}
                          alt=""
                        />
                      ) : scorePercentage < 40 ? (
                        <Image
                          src="/images/level_2.png"
                          width={16}
                          height={16}
                          alt=""
                        />
                      ) : scorePercentage < 60 ? (
                        <Image
                          src="/images/level_3.png"
                          width={16}
                          height={16}
                          alt=""
                        />
                      ) : scorePercentage < 80 ? (
                        <Image
                          src="/images/level_4.png"
                          width={16}
                          height={16}
                          alt=""
                        />
                      ) : (
                        <Image
                          src="/images/level_5.png"
                          width={16}
                          height={16}
                          alt=""
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {/* TODO: Rid of infinite scrolling target element */}
        {/* Target element for infinite scroll */}
        {/* {loading ? (
          <p className="text-center">Loading more...</p>
        ) : (
          <div className="h-[1px]" />
        )} */}
      </div>
      {loading && (
        <p className="text-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-bold">
          Loading...
        </p>
      )}
      {/* Pagination section */}
      <div className="relative flex justify-between items-center p-4 text-xs font-bold">
        {maxPage !== 0 && (
          <>
            {/* Pagination info */}
            <span className="hidden md:block">
              Showing {(page - 1) * pageSize + 1} to {page * pageSize} of{" "}
              {data?.totalCount || 0} results
            </span>
            {/* Pagination action buttons */}
            <div className="flex items-center gap-3 relative md:absolute md:left-1/2 md:-translate-x-1/2">
              <button
                className="flex justify-center items-center w-[15px] h-[15px] disabled:opacity-25"
                onClick={handleGoToPrevPage}
                disabled={page <= 1}
              >
                <LeftChevronIcon />
              </button>
              <div className="flex gap-2">
                {visiblePageNumbers.map((pg) => (
                  <button
                    key={`pagination-btn-${pg}`}
                    className={clsx(
                      "flex justify-center items-center w-[21px] h-4 rounded-[100px] border border-black/0",
                      pg === page && "border-black/100",
                    )}
                    onClick={() => handleGoToPage(pg)}
                  >
                    {pg}
                  </button>
                ))}
                {/* TODO: Confirm UX */}
                {/* <button
                className="flex justify-center w-[21px] h-4 font-bold"
                onClick={handleGoToNextPages}
              >
                ...
              </button>
              <button
                className="flex justify-center w-[21px] h-4 font-bold"
                onClick={() => handleGoToPage(maxPage)}
              >
                {maxPage}
              </button> */}
              </div>
              <button
                className="flex justify-center items-center w-[15px] h-[15px] disabled:opacity-25"
                onClick={handleGoToNextPage}
                disabled={page >= maxPage}
              >
                <RightChevronIcon />
              </button>
            </div>
            {/* Row count selector */}
            <div className="flex justify-center items-center gap-2">
              <span>Rows</span>
              <Dropdown
                options={
                  Object.values(ELeaderBoardPageSize).filter(
                    (value) => typeof value === "number",
                  ) as number[]
                }
                value={pageSize}
                onSelectOption={handleCountPerPageChange}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex justify-between gap-2 items-center px-9 h-8 font-bold text-[10px] overflow-x-auto hidden-scrollbar bg-[#decca2] border-t-2 border-t-black">
        <Tooltip
          content="Entry Level: New members who’ve just started contributing. They plant the seeds of engagement by mentioning the plant occasionally. Requirements: Minimal contributions like basic mentions or interactions."
          placement="bottom"
        >
          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
            <div className="flex gap-1 items-center text-xs w-max">
              <Image src="/images/level_1.png" width={16} height={16} alt="" />
              (0 - 20%)
            </div>
            <span>Seed Planters</span>
            <QuestionIcon />
          </div>
        </Tooltip>
        <Tooltip
          content="Intermediate Level: Members who consistently provide relevant and thoughtful mentions, helping the plant grow strong roots. Requirements: Regular participation with more relevant and deeper mentions."
          placement="bottom"
        >
          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
            <div className="flex gap-1 items-center text-xs w-max">
              <Image src="/images/level_2.png" width={16} height={16} alt="" />
              (20 - 40%)
            </div>
            <span>Soil Tenders</span>
            <QuestionIcon />
          </div>
        </Tooltip>
        <Tooltip
          content="Advanced Level: Highly active members whose mentions are consistently engaging, positive, and insightful, acting as the plant's main source of growth. Requirements: High-quality mentions, positive sentiment, and creative contributions."
          placement="bottom"
        >
          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
            <div className="flex gap-1 items-center text-xs w-max">
              <Image src="/images/level_3.png" width={16} height={16} alt="" />
              (40 - 60%)
            </div>
            <span>Sunlight Bringers</span>
            <QuestionIcon />
          </div>
        </Tooltip>
        <Tooltip
          content="Expert Level: Top-tier contributors who bring novelty, enthusiasm, and drive engagement across the community, making the plant thrive. Requirements: Exceptional engagement, introducing novel ideas, and driving significant community activity."
          placement="bottom"
        >
          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
            <div className="flex gap-1 items-center text-xs w-max">
              <Image src="/images/level_4.png" width={16} height={16} alt="" />
              (60 - 80%)
            </div>
            <span>Blossom Cultivators</span>
            <QuestionIcon />
          </div>
        </Tooltip>
        <Tooltip
          content="Elite Level: The most dedicated and impactful members who consistently lead the community, provide key insights, and help others contribute. They are the ultimate nurturers of the plant’s growth. Requirements: Leadership in engagement, top-quality contributions, and recognition as community role models."
          placement="bottom"
        >
          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
            <div className="flex gap-1 items-center text-xs w-max">
              <Image src="/images/level_5.png" width={16} height={16} alt="" />
              (80 - 100%)
            </div>
            <span>Master Gardeners</span>
            <QuestionIcon />
          </div>
        </Tooltip>
      </div>
    </Card>
  );
};

export default LeaderBoard;
