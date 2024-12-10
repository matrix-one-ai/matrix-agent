/* eslint-disable @typescript-eslint/no-explicit-any */
import { ECountries } from "@/app/types";
import { NextResponse } from "next/server";

const mapCountryToCurrency = (country: ECountries) => {
  switch (country) {
    case ECountries.USA:
      return "USD";
    case ECountries.CANADA:
      return "CAD";
    case ECountries.EUROPE:
      return "EUR";
    case ECountries.UNITED_KINGDOM:
      return "GBP";
    default:
      return "USD";
  }
};

export async function POST(res: Request) {
  try {
    const event = await res.json();

    const tx = JSON.parse(event.transaction);
    console.log("HELIO WEBHOOK EVENT", tx);

    let additionalJSON: any = {};
    try {
      const innerJSON = JSON.parse(tx.meta.customerDetails.additionalJSON);
      additionalJSON = JSON.parse(innerJSON);
    } catch (error) {
      console.log("Error parsing additionalJSON:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

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
          body: JSON.stringify({
            recipientEmail,
            sendEmail: false,
            amount: Number(additionalJSON.amount),
          }),
        }
      );  

      const skyfireData = await response.json();
      console.log("Skyfire API Response", skyfireData);

      const emailResp = await fetch("/api/email", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          toEmail: additionalJSON.email,
          subject: "Sami's Gift Card",
          giftMessage: additionalJSON.giftMessage,
          amount: additionalJSON.amount,
          redeemCode: skyfireData.redeemCode.pinCode,
          currency: mapCountryToCurrency(additionalJSON.country),
        }),
      });

      const emailData = await emailResp.json();

      console.log("Email API Response", emailData);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
