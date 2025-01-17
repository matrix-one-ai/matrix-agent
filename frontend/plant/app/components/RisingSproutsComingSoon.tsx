import React from "react";
import Card from "@/app/components/Card/Card";
import Link from "next/link";

const RisingSproutsComingSoon = () => {
  return (
    <Card
      contentClassName="flex flex-col !p-0 cursor-default"
      title="Rising Sprouts"
    >
      <div className="relative w-full h-[40vh] flex-grow overflow-auto gap-6 p-2 md:p-4 font-bold flex flex-col items-center justify-center">
        <p className="text-center text-2xl">
          🚧 Coming soon for $PLANT Stakers 🚧
          <br />
          (over 500,000)
        </p>
        <Link
          className="px-4 py-1 border border-black rounded-[100px] hover:bg-[#F9E9C4]"
          href="/"
          target="_blank"
        >
          Stake Here
        </Link>
      </div>
    </Card>
  );
};

export default RisingSproutsComingSoon;
