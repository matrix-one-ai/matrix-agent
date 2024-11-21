"use client";

import ActivityLog from "./components/ActivityLog";

const LittleCard = ({ title }: { title: string }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100px",
        height: "100px",
        backgroundColor: "white",
        margin: "10px",
        alignItems: "center",
        justifyContent: "center",
        color: "#f789b9",
      }}
    >
      {title}
    </div>
  );
};

const ClientPage = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "95.5vh",
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
        <LittleCard title="get $SAMI" />
        <LittleCard title="email me plz" />
        <LittleCard title="call me" />
        <LittleCard title="my tweets" />
        <LittleCard title="my photo gallery" />
        <LittleCard title="buy my merch" />
      </div>
    </div>
  );
};

export default ClientPage;
