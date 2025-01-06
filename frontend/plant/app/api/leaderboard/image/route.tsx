import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";

// matt plz finish / fix this API.

// 1.) Ian needs to orchasterate when based on rules of leaderboard, a user is picked for a Twitter post. (don't spam, no duplicates, user can only be featured once).
// 2.) Ian fetches: https://plant.fun/api/leaderboard/image?userName=cjft&twitterAvatarUrl=https://pbs.twimg.com/profile_images/1440000000000000000/aaaaaaaa_normal.jpg GET -> return .png
// 3.) Ian used .png returned from request, posts a tweet with v2 API like: "Welcome @cjft to the leaderboard! 🌵🎉 <attach image>"

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userName = searchParams.get("userName");
  const twitterAvatarUrl = searchParams.get("twitterAvatarUrl");

  if (!userName) {
    return NextResponse.json("Missing username", { status: 400 });
  }

  if (!twitterAvatarUrl) {
    return NextResponse.json("Missing twitterAvatarUrl", { status: 400 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 40,
          color: "white",
          background: "black",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Hello {userName}!
        <img src={twitterAvatarUrl} alt="User Avatar" />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
