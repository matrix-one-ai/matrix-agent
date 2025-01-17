import { NextResponse } from "next/server";
import { getBaseUrl } from "@/app/api/utils/baseUrl";

export async function GET() {
  try {
    const baseUrl = getBaseUrl();

    // Authenticate first
    const authResp = await fetch(`${baseUrl}/api/azure-sass/auth`, {
      headers: {
        cache: "no-store",
      },
    });

    if (authResp.ok) {
      const { data } = await authResp.json();

      if (!data) {
        throw new Error("Authentication failed");
      }

      // After authentication, fetch latest tweet data
      const latestTweetResp = await fetch(
        "https://sami-one-portal-be.azurewebsites.net/api/services/app/twitter/GetPlantLatestTweets",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data}`,
            cache: "no-store",
          },
        },
      );

      const latestTweetData = await latestTweetResp.json();

      if (latestTweetData.error) {
        throw new Error(latestTweetData.error);
      }

      return NextResponse.json({ data: latestTweetData.result });
    } else {
      throw new Error(authResp.statusText);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
