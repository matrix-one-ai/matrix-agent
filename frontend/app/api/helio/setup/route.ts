import { NextResponse } from "next/server";

export async function POST() {
  console.log("HELIO_PUBLIC_KEY", process.env.HELIO_PUBLIC_KEY);
  console.log("HELIO_SECRET_KEY", process.env.HELIO_SECRET_KEY);
  console.log(
    "NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK",
    process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK
  );
  console.log("HELIO_WEBHOOK_URL", process.env.HELIO_WEBHOOK_URL);

  try {
    const resp = await fetch(
      `https://api.hel.io/v1/webhook/paylink/transaction?apiKey=${process.env.HELIO_PUBLIC_KEY}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HELIO_SECRET_KEY}`,
          "cache-control": "no-cache",
        },
        body: JSON.stringify({
          paylinkId: process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK,
          targetUrl: `${process.env.HELIO_WEBHOOK_URL}/api/helio/webhook`,
          events: ["CREATED"],
        }),
      }
    );

    if (resp.ok) {
      console.log("Gift Card", await resp.json());
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 500 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
