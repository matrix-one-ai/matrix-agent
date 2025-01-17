import { NextResponse } from "next/server";
import { getBaseUrl } from "@/app/api/utils/baseUrl";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.characterName ||
      !body.personaName ||
      !body.twitterHandle ||
      !body.solanaWallet
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const baseUrl = getBaseUrl();

    // Authenticate first
    const authResp = await fetch(`${baseUrl}/api/azure-sass/auth`, {
      headers: {
        cache: "no-store",
      },
    });

    if (authResp.ok) {
      const { data: accessToken } = await authResp.json();

      if (!accessToken) {
        throw new Error("Authentication failed");
      }

      const response = await fetch(
        "https://sami-one-portal-be.azurewebsites.net/api/services/app/CharacterPersona/UpdateCharacterPersonaSolanaWallet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            cache: "no-store",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return NextResponse.json({ data: data.result });
    } else {
      throw new Error(authResp.statusText);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
