import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";

const loadFont = async (fontUrl: string): Promise<ArrayBuffer> => {
  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error("Font failed to load");
  }
  return response.arrayBuffer();
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userName = searchParams.get("userName");
  const twitterAvatarUrl = searchParams.get("twitterAvatarUrl");

  if (!userName) {
    return NextResponse.json("Missing username", { status: 400 });
  }

  if (!twitterAvatarUrl) {
    return NextResponse.json("Missing twitterAvatarUrl", { status: 400 });
  }

  try {
    const urlOrigin =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "https://plant.fun";
    const fontData = await loadFont(
      `${urlOrigin}/fonts/Comic Sans MS Bold.ttf`,
    );
    const backgroundImage = `${urlOrigin}/images/post.png`;

    return new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "1200px 630px",
            backgroundPosition: "center",
            boxSizing: "border-box",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "72%",
              padding: "36px",
              paddingTop: "96px",
              gap: "24px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={twitterAvatarUrl}
              alt="User Avatar"
              width={150}
              height={150}
              style={{
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 0,
                flexGrow: 1,
                gap: "18px",
              }}
            >
              <span
                style={{
                  fontSize: 38,
                  color: "#70C238",
                  textShadow:
                    "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                }}
              >
                @{userName}
              </span>
              <span style={{ fontSize: 38, color: "black" }}>
                I am a Gardener for Plant and will be showered with
                Rain(air)drops!
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
            weight: 400,
          },
        ],
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(`Failed to generate the image`, {
      status: 500,
    });
  }
}
