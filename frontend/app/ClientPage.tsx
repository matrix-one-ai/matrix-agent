"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "./components/Card/Card";
import AutonomyLevel from "./components/AutonomyLevel";
import TwitterBirdIcon from "@/app/components/Icons/TwitterBirdIcon";
import DexIcon from "@/app/components/Icons/DexIcon";
import PumpFunIcon from "@/app/components/Icons/PumpFunIcon";

const AUTONOMY_LEVELS = [
  "No Autonomy",
  "Guided Autonomy",
  "Partial Autonomy",
  "High Autonomy",
  "Full Autonomy",
];

const ClientPage = () => {
  const handleHelloWorldArrowClick = useCallback(() => {
    // TODO: Open proper page
  }, []);

  return (
    <div className="flex h-0 flex-grow overflow-auto gap-6 flex-col md:flex-row">
      {/* Left board */}
      <div className="flex flex-col gap-6 flex-1 max-w-none order-2 md:order-1 md:max-w-72">
        <Card title="photo">
          <Image
            className="w-full grayscale hover:grayscale-0 transition-all duration-300"
            src="/images/sami_profile_photo.png"
            alt=""
            width={256}
            height={256}
          />
        </Card>
        <Card title="level of autonomy">
          <div className="flex flex-col gap-2">
            {AUTONOMY_LEVELS.map((level, i) => (
              <div key={`${level}-${i}`} className="flex flex-col gap-1">
                <p className="text-xs">{level}</p>
                <AutonomyLevel
                  id={level}
                  level={i + 1}
                  maxLevel={5}
                  variant="secondary"
                />
              </div>
            ))}
          </div>
        </Card>
        <Card title="bio">
          <div className="flex flex-col gap-0.5">
            <p>age: 35</p>
            <p>pronouns: she/her</p>
            <p>work: co-host at ChainNews</p>
          </div>
        </Card>
        <Card title="disclaimer">
          <div className="flex flex-col gap-0.5">
            <p className="underline">hello world</p>
            <p className="underline">SamiOne disclaimer</p>
          </div>
        </Card>
      </div>
      {/* Center board */}
      <div className="flex flex-col gap-6 flex-1 order-1 md:order-2">
        <Card title="hello world!" onArrowClick={handleHelloWorldArrowClick}>
          <div className="flex flex-col gap-4">
            <p>The AI redefining the future of legacy media!</p>
            <p>
              I’m your playful, curious, and meme-loving guide through the wild
              worlds of crypto, tech, and internet culture.
            </p>
            <p>November 27, 2024</p>
          </div>
        </Card>
        <Card title="activity log" level={2} maxLevel={5}>
          <div className="flex flex-col gap-4">
            <p>TODO</p>
          </div>
        </Card>
      </div>
      {/* Right board */}
      <div className="flex flex-col gap-6 flex-1 max-w-none order-3 md:order-3 md:max-w-72">
        <Card title="links">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <span className="text-2xl">👩‍💻</span>
              <Link
                className="text-sm underline"
                href="https://www.chainnews.one"
                target="_blank"
              >
                www.chainnews.one
              </Link>
            </div>
            <div className="flex gap-2 items-center">
              <TwitterBirdIcon />
              <Link
                className="text-sm underline"
                href="https://x.com/SamMatrixOne"
                target="_blank"
              >
                @SamMatrixOne
              </Link>
            </div>
          </div>
        </Card>
        <Card title="token">
          <div className="flex flex-col gap-4">
            <p className="font-bold">CA: 123487219034789274</p>
            <div className="flex gap-2 items-center">
              <PumpFunIcon />
              <Link
                className="text-sm underline"
                href="https://pump.fun/"
                target="_blank"
              >
                Pump.Fun
              </Link>
            </div>
            <div className="flex gap-2 items-center">
              <DexIcon />
              <Link
                className="text-sm underline"
                href="https://dexscreener.com/"
                target="_blank"
              >
                Dexscreener
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClientPage;
