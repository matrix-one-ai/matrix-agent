import React from "react";
import Card from "@/app/components/Card/Card";
import Link from "next/link";

const RisingSproutsComingSoon = () => {
  return (
    <Card
      contentClassName="flex flex-col !p-0 cursor-default"
      title="Rising Sprouts"
    >
      <div className="relative w-full h-[50vh] flex-grow overflow-auto p-2 md:p-4 font-bold flex flex-col items-center justify-center">
        <p className="text-center text-2xl mb-4">
          🚧 Coming soon! 🚧
          <br />
          Exclusive Rewards for $PLANT Stakers
        </p>
        <p className="text-center text-sm mb-6">
          Stake 500,000+ $PLANT to unlock Rising Sprouts
          <br />
          high-potential tokens analyzed by Plant as soon as they hit Raydium or
          Meteora.
        </p>
        <p className="text-center text-base mb-2">Secure Your Early Access</p>
        <Link
          className="px-4 py-1 border border-black rounded-[100px] hover:bg-[#F9E9C4]"
          href="https://app.wasabi.xyz/vaults?vault=sPLANT&network=solana"
          target="_blank"
        >
          Stake Here
        </Link>
      </div>
    </Card>
  );
};

export default RisingSproutsComingSoon;
