import React from "react";
import Card from "@/app/components/Card/Card";
import Link from "next/link";

const SproutTokensComingSoon = () => {
  return (
    <Card
      contentClassName="flex flex-col !p-0 cursor-default"
      title="Sprout Tokens"
    >
      <div className="relative w-full h-[50vh] flex-grow overflow-auto p-2 md:p-4 font-bold flex flex-col items-center justify-center">
        <p className="text-center text-2xl mb-4">
          🚧 Coming Soon to Sprout Tokens! 🚧
        </p>
        <p className="text-center text-base mb-2">
          Plant constantly evaluates a project on socials before the token is
          launched.
          <br />
          As soon as the tokens launches you will be able to track it here.
        </p>
        <Link
          className="px-4 py-1 border border-black rounded-[100px] hover:bg-[#F9E9C4]"
          href="/"
          target="_blank"
        >
          Submit Project
        </Link>
      </div>
    </Card>
  );
};

export default SproutTokensComingSoon;
