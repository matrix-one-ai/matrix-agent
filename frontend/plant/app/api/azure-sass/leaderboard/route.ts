import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const revalidate = 0;

let authAccessToken = "";

/**
 * Checks if a JWT access token is expired
 * @param token
 * @returns A boolean indicating if the token is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    // Decode the token without verifying the signature
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || !decoded.exp) {
      throw new Error("Invalid token or missing expiration claim");
    }

    // Get the current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Compare with the expiration time
    return currentTime >= decoded.exp;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error decoding token:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return true; // Treat as expired if there's an error
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "null", 10);
  const pageSize = parseInt(searchParams.get("pagesize") || "null", 10);
  const personalName = searchParams.get("personalName");

  try {
    if (!authAccessToken || isTokenExpired(authAccessToken)) {
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

      authAccessToken = authData.result.accessToken;
    }

    const leaderboardResp = await fetch(
      "https://sami-one-portal-be.azurewebsites.net/api/services/app/CharacterPersonaRank/GetCharacterPersonaRanking",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authAccessToken}`,
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
