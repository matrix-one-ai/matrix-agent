import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl } from "@/app/api/utils/baseUrl";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "null", 10);
  const pageSize = parseInt(searchParams.get("pagesize") || "null", 10);
  const personaName = searchParams.get("personaName");
  const sorting = searchParams.get("sorting");

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

      // After authentication, fetch leaderboard data
      const leaderboardResp = await fetch(
        "https://sami-one-portal-be.azurewebsites.net/api/services/app/CharacterPersonaRank/GetCharacterPersonaRanking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data}`,
            cache: "no-store",
          },
          body: JSON.stringify({
            maxResultCount: pageSize,
            skipCount: (page - 1) * pageSize,
            characterName: "Plant",
            ...(personaName && { personaName }),
            ...(sorting && { sorting }),
          }),
        },
      );

      const leaderboardData = await leaderboardResp.json();

      if (leaderboardData.error) {
        throw new Error(leaderboardData.error);
      }

      return NextResponse.json({ data: leaderboardData.result });
    } else {
      throw new Error(authResp.statusText);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
