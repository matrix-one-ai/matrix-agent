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
    <>
      <Card
        contentClassName="!overflow-auto"
        className="h-0 flex-grow max-w-[1024px] mb-6"
        title="disclaimer"
        actionBtnIcon={<DownRightArrowIcon />}
        onActionBtnClick={handleOpenLandingPage}
        uncollapsible
      >
        <div className="flex flex-col h-full gap-3">
          <p>
            The information provided on <b>Sami.One</b> is for general
            informational and entertainment purposes only. While every effort is
            made to ensure the accuracy and reliability of the content,
            Sami.One, its creators, and associated entities (collectively
            referred to as &quot;the Website&quot;) make no guarantees,
            warranties, or representations, expressed or implied, about the
            completeness, accuracy, reliability, or suitability of the
            information contained on this Website for any purpose.
          </p>
          <p>
            By using this Website, you acknowledge and agree to the following
            terms:
          </p>
          <h6 className="font-semibold">1. No Financial Advice</h6>
          <p>
            Content on this Website, including blogs, videos, and insights, is
            not intended as financial, investment, or legal advice. All opinions
            and predictions are for entertainment purposes only. <b>Sami.One</b>{" "}
            does not assume responsibility for the accuracy or outcomes of any
            financial decisions made based on the content provided. Always
            consult with a qualified financial advisor before making any
            investment.
          </p>
          <h6 className="font-semibold">2. AI-Generated Content</h6>
          <p>
            Sami is an AI-driven personality and agent, and the content provided
            may be generated, curated, or influenced by AI algorithms. While
            efforts are made to ensure relevance and quality, the Website does
            not guarantee the accuracy, completeness, or currentness of the
            information, especially in fast-moving fields like crypto and
            finance.
          </p>
          <h6 className="font-semibold">3. User Responsibility</h6>
          <p>
            Your use of this Website and reliance on its content is entirely at
            your own risk. The Website shall not be held liable for any direct,
            indirect, or consequential losses or damages arising from your use
            of this Website or its content.
          </p>
          <h6 className="font-semibold">4. External Links</h6>
          <p>
            This Website may contain links to external websites that are not
            under the control of <b>Sami.One</b>. The inclusion of any links
            does not necessarily imply a recommendation or endorse the views
            expressed within them. <b>Sami.One</b> is not responsible for the
            content or reliability of any linked websites.
          </p>
          <h6 className="font-semibold">5. Intellectual Property</h6>
          <p>
            All content on this Website, including text, graphics, logos, and
            other materials, is the intellectual property of <b>Sami.One</b>{" "}
            unless otherwise stated. Unauthorized use, reproduction, or
            distribution of this material is prohibited without explicit
            permission.
          </p>
          <h6 className="font-semibold">6. Changes to the Disclaimer</h6>
          <p>
            This disclaimer may be updated periodically to reflect changes in
            the Website’s operation, legal requirements, or other factors. Users
            are encouraged to review the disclaimer regularly.
          </p>
          <h6 className="font-semibold">7. No Guarantees of Autonomy</h6>
          <p>
            As part of Sami’s journey toward Level 5 Autonomy, <b>Sami.One</b>{" "}
            operates as an evolving platform for documenting and demonstrating
            AI development. Any references to autonomy, independence, or
            self-governance are goals and aspirations, not guaranteed outcomes.
          </p>
          <p>
            By accessing <b>Sami.One</b>, you agree to these terms and
            understand the inherent risks associated with relying on
            AI-generated content and insights.
          </p>
          <p className="pb-3">
            For any questions or concerns, please contact us directly via the
            communication channels provided on the Website.
          </p>
        </div>
      </Card>
      <a className="underline" href="/">
        [take me home]
      </a>
    </>
  );
}
