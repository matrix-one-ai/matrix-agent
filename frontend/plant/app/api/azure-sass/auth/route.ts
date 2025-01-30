import { NextResponse } from "next/server";
// import jwt, { JwtPayload } from "jsonwebtoken";

// let authAccessToken = "";

// /**
//  * Checks if a JWT access token is expired
//  * @param token
//  * @returns A boolean indicating if the token is expired
//  */
// function isTokenExpired(token: string): boolean {
//   try {
//     // Decode the token without verifying the signature
//     const decoded = jwt.decode(token) as JwtPayload | null;

//     if (!decoded || !decoded.exp) {
//       throw new Error("Invalid token or missing expiration claim");
//     }

//     // Get the current time in seconds
//     const currentTime = Math.floor(Date.now() / 1000);

//     // Compare with the expiration time
//     return currentTime >= decoded.exp;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error decoding token:", error.message);
//     } else {
//       console.error("Unexpected error:", error);
//     }
//     return true; // Treat as expired if there's an error
//   }
// }

export async function GET() {
  try {
    // if (!authAccessToken || isTokenExpired(authAccessToken)) {
    //   const authResp = await fetch(
    //     "https://sami-one-portal-be.azurewebsites.net/api/TokenAuth/Authenticate",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Abp.TenantId": "2",
    //       },
    //       body: JSON.stringify({
    //         userNameOrEmailAddress: "external-api",
    //         password: "egq3yxq!QEX!myq2cyb",
    //       }),
    //       cache: "no-cache",
    //     },
    //   );

    //   const authData = await authResp.json();

    //   if (authData.error || !authData?.result?.accessToken) {
    //     throw new Error(authData.error || "Authentication failed");
    //   }

    //   authAccessToken = authData.result.accessToken;
    // }

    // return NextResponse.json({ data: authAccessToken });

    // TODO: Just return mock data replacing token. Not recommened...
    return NextResponse.json({
      data: "matrix-5dd9ae979c7d440e9e5602b25e08f65d",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
