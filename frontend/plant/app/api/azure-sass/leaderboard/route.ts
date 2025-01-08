import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "null", 10);
  const pageSize = parseInt(searchParams.get("pagesize") || "null", 10);
  const personalName = searchParams.get("personalName");

  try {
    const authResp = await fetch(
      "https://sami-one-portal-be.azurewebsites.net/api/TokenAuth/Authenticate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Abp.TenantId": "2",
          cache: "no-cache",
        },
        body: JSON.stringify({
          userNameOrEmailAddress: "external-api",
          password: "egq3yxq!QEX!myq2cyb",
        }),
      },
    );

    const authData = await authResp.json();

    if (authData.error || !authData?.result?.accessToken) {
      console.log(authData.error);
      return NextResponse.json({ error: authData.error }, { status: 500 });
    }

    const leaderboardResp = await fetch(
      "https://sami-one-portal-be.azurewebsites.net/api/services/app/CharacterPersonaRank/GetCharacterPersonaRanking",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.result.accessToken}`,
          cache: "no-cache",
        },
        body: JSON.stringify({
          maxResultCount: pageSize,
          skipCount: (page - 1) * pageSize,
          characterName: "Plant",
          ...(personalName && { personalName }),
        }),
      },
    );

    const leaderboardData = await leaderboardResp.json();

    if (leaderboardData.error) {
      console.log(leaderboardData.error);
      return NextResponse.json(
        { error: leaderboardData.error },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: leaderboardData.result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
