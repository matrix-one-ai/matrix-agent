import { NextResponse } from "next/server";

export async function POST(res: Request) {
  try {
    const event = await res.json();

    const tx = JSON.parse(event.transaction);
    console.log("HELIO WEBHOOK EVENT", tx);

    if (tx.meta.transactionStatus === "SUCCESS") {
      const recipientEmail =
        tx.meta.customerDetails.email || "recipient@example.com";

      console.log(recipientEmail);

      // Call the Skyfire gift card API
      const response = await fetch(
        "https://api-qa.skyfire.xyz/v1/receivers/reloadly/gift-card",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "skyfire-api-key": process.env.SKYFIRE_API_KEY!,
          },
          body: JSON.stringify({ recipientEmail }),
        }
      );

      const data = await response.json();
      console.log("Skyfire API Response", data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
