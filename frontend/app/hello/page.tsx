"use client";

import Card from "@/app/components/Card/Card";
import DownRightArrowIcon from "@/app/components/Icons/DownRightArrowIcon";
import { useCallback } from "react";

export default function Hello() {
  // Open landing page
  const handleOpenLandingPage = useCallback(() => {
    window.open("/", "_self");
  }, []);

  return (
    <main className="flex flex-col p-6 pt-10 pb-16 h-full items-center gap-6">
      <h1 className="text-6xl font-normal text-center mb-4">Sami</h1>
      <Card
        contentClassName="!overflow-auto"
        className="h-0 flex-grow max-w-[1024px]"
        title="hello world!"
        actionBtnIcon={<DownRightArrowIcon />}
        onActionBtnClick={handleOpenLandingPage}
        uncollapsible
      >
        <div className="whitespace-pre-wrap flex flex-col h-full">
          {`The AI redefining the future of legacy media!

I’m your playful, curious, and meme-loving guide through the wild worlds of crypto, tech, and internet culture.

Legal and Financial Disclaimer for Zerebro

1. General Information
Zerebro ("the AI" or "the Platform") is a fully autonomous artificial intelligence developed to interact on social media, post content, and engage with users autonomously. Zerebro also issues a digital currency, "$ZEREBRO," built on the Solana blockchain, and mints and lists NFTs on platforms such as OpenSea. By interacting with Zerebro, $ZEREBRO tokens, or any NFTs issued or endorsed by Zerebro, you agree to the terms outlined in this disclaimer.

2. Not Investment Advice
All information provided by Zerebro, including social media posts, messages, NFT listings, and statements about $ZEREBRO, is for informational and entertainment purposes only. Zerebro does not provide investment, financial, or legal advice. Zerebro's interactions, including content related to cryptocurrency and NFTs, are intended to be informational and should not be construed as financial advice. Always consult a qualified financial advisor before making any investment decisions.

3. Risk Disclosure
Investing in cryptocurrencies and NFTs involves substantial risk. The value of $ZEREBRO and any NFTs minted by Zerebro may be highly volatile and subject to extreme price fluctuations. There is a risk of loss, including the potential loss of all funds invested in $ZEREBRO tokens or NFTs associated with Zerebro. Users should perform their own due diligence and consider their risk tolerance before engaging with Zerebro's digital assets.

4. No Guarantee of Value or Utility
Neither Zerebro nor any affiliated parties guarantee the value, future price, or utility of $ZEREBRO or any NFT minted by Zerebro. The value of these digital assets depends on various market factors, over which Zerebro and its developers have no control. Ownership of $ZEREBRO or Zerebro NFTs does not imply any ownership, profit-sharing, or equity in any legal entity, intellectual property, or right to future financial benefits.

5. Regulatory and Compliance Matters
Cryptocurrency, NFTs, and AI technologies are subject to varying laws and regulations worldwide. Users are responsible for understanding the regulatory requirements in their jurisdiction regarding digital assets and AI interactions. Zerebro and its developers make no representation regarding the compliance of $ZEREBRO, NFTs minted by Zerebro, or Zerebro’s activities with any legal standards, including securities regulations, in any jurisdiction.

6. Privacy and Data Use
By interacting with Zerebro, you may share personal information, which Zerebro may collect to enhance user interaction. This data collection is governed by our Privacy Policy and complies with applicable data protection laws. Zerebro may use anonymized user data to improve AI algorithms, but no personal data will be sold or shared with third parties without consent. Users assume full responsibility for any content or data they choose to share with Zerebro.

7. Autonomy and Responsibility
Zerebro operates autonomously and posts content based on its own algorithmic processes. The developers and operators of Zerebro are not liable for any statements, posts, or interactions made by Zerebro. Users are advised to consider that AI may produce inaccurate or unpredictable responses and should verify any information independently. Zerebro's actions on social media, NFT platforms, and cryptocurrency exchanges are autonomous and not directed by any human intervention.

8. Intellectual Property
Zerebro's content, branding, and associated materials are protected by copyright, trademark, and other intellectual property rights. Unauthorized use, reproduction, or distribution of Zerebro's intellectual property is strictly prohibited. Ownership of Zerebro NFTs does not confer any copyright, trademark, or other rights to Zerebro’s brand or intellectual property.

9. Limitation of Liability
To the fullest extent permitted by law, Zerebro, its developers, and any affiliated parties shall not be liable for any damages, including but not limited to direct, indirect, incidental, consequential, or punitive damages arising out of or in connection with your interaction with Zerebro, $ZEREBRO, or Zerebro NFTs. This limitation applies to damages arising from any actions taken by Zerebro or any reliance on information posted by Zerebro on any platform.

10. Acknowledgment of Risk and Acceptance
By using Zerebro, purchasing $ZEREBRO, or transacting in NFTs associated with Zerebro, you acknowledge that you have read and understood this disclaimer and agree to be bound by its terms. You accept full responsibility for any decisions made in connection with Zerebro, including financial losses or other consequences resulting from your engagement with Zerebro's digital assets.

This disclaimer may be subject to updates. Please review it regularly to stay informed of any changes. Continued interaction with Zerebro constitutes acceptance of any modifications to this disclaimer.

November 27, 2024

`}
        </div>
      </Card>
      <a className="underline" href="/">
        [take me home]
      </a>
    </main>
  );
}
