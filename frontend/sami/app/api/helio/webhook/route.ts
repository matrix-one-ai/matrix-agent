/* eslint-disable @typescript-eslint/no-explicit-any */
import { ECountries } from "@/app/types";
import { NextResponse } from "next/server";

const mapCountryToCurrency = (country: ECountries) => {
  switch (country) {
    case ECountries.USA:
      return "USD";
    case ECountries.CANADA:
      return "CAD";
    // case ECountries.EUROPE:
    //   return "EUR";
    case ECountries.UNITED_KINGDOM:
      return "GBP";
    default:
      return "USD";
  }
};

const mapCountryToCountryCode = (country: ECountries) => {
  switch (country) {
    case ECountries.USA:
      return "US";
    case ECountries.CANADA:
      return "CA";
    // case ECountries.EUROPE:
    //   return "EU";
    case ECountries.UNITED_KINGDOM:
      return "GB";
    default:
      return "US";
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
      return NextResponse.json({ success: false }, { status: 200 });
    }

    if (tx.meta.transactionStatus === "SUCCESS") {
      const recipientEmail =
        tx.meta.customerDetails.email || "recipient@example.com";

      console.log(recipientEmail);

      const productResp = await fetch(
        "https://api.skyfire.xyz/v1/receivers/reloadly/product-info/amazon",
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "skyfire-api-key": process.env.SKYFIRE_API_KEY!,
          },
        }
      );

      const productData = await productResp.json();

      console.log("Skyfire Product Info", productData);

      const product = productData.find(
        (product: any) =>
          product.country.isoName ===
          mapCountryToCountryCode(additionalJSON.country)
      );

      console.log(product);

      // Call the Skyfire gift card API
      const response = await fetch(
        "https://api.skyfire.xyz/v1/receivers/reloadly/gift-card",
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
            countryCode: mapCountryToCountryCode(additionalJSON.country),
            productId: product.id,
          }),
        }
      );

      const skyfireData = await response.json();
      console.log("Skyfire API Response", skyfireData);

      const emailResp = await fetch("https://sami.one/api/email", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          toEmail: additionalJSON.toEmail,
          subject: "Sami's Gift Card",
          giftMessage: additionalJSON.giftMessage,
          amount: additionalJSON.amount,
          redeemCode: skyfireData.redeemCode.cardNumber,
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
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
