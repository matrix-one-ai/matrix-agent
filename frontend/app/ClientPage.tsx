"use client";

import { ReactNode } from "react";
import ActivityLog from "./components/ActivityLog";
import Gifs from "./components/Gifs";
import TraderViewWidget from "./components/TraderViewWidget";
import BackgroundGif from "./components/BackgroundGif";

const LittleCard = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => {
  return (
    <div
      style={{
        display: "flex",
        width: "150px",
        height: "150px",
        backgroundColor: "#ffffff91",
        margin: "10px",
        alignItems: "center",
        justifyContent: "center",
        color: "#f789b9",
      }}
    >
      {children ? children : title}
    </div>
  );
};

const ClientPage = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 60px)",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <LittleCard title="bio" />
        <LittleCard title="work" />
        <LittleCard title="my mixtape" />
        <LittleCard title="my podcast" />
        <LittleCard title="my partners" />
        <LittleCard title="terms" />
      </div>
      <div
        style={{
          flex: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "60%",
        }}
      >
        <ActivityLog />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <LittleCard title="get $SAMI">
          <TraderViewWidget />
        </LittleCard>
        <LittleCard title="email me plz" />
        <LittleCard title="call me" />
        <LittleCard title="my tweets" />
        <LittleCard title="my photo gallery" />
        <LittleCard title="buy my merch" />
      </div>

      <Gifs />

      <BackgroundGif />
    </div>
  );
};

export default ClientPage;
