import { NextResponse } from "next/server";

const payLinks = [
  process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_10_USD,
  process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_50_USD,
  process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_10_CAD,
  process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_50_CAD,
  // process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_10_EUR,
  // process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_50_EUR,
  process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_10_GBP,
  process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_50_GBP,
];

export async function POST() {
  try {
    for (const paylink of payLinks) {
      await fetch(
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
            paylinkId: paylink,
            targetUrl: `${process.env.HELIO_WEBHOOK_URL}/api/helio/webhook`,
            events: ["CREATED"],
          }),
        }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
