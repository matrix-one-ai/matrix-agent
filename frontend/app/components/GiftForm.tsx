"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { z } from "zod";
import Card from "@/app/components/Card/Card";
import DownRightArrowIcon from "@/app/components/Icons/DownRightArrowIcon";
import BitcoinIcon from "@/app/components/Icons/BitcoinIcon";
import EthereumIcon from "@/app/components/Icons/EthereumIcon";
import M1Icon from "@/app/components/Icons/M1Icon";
import Sami1Icon from "@/app/components/Icons/Sami1Icon";
import SolanaIcon from "@/app/components/Icons/SolanaIcon";
import { useRouter } from "next/navigation";
import Dropdown from "./Dropdown";
import { Message, useChat } from "ai/react";
import { EAmount, ECountries, ERelationship } from "../types";
import { generateGiftMessage } from "../utils/prompts";
import { HelioCheckout, HelioEmbedConfig } from "@heliofi/checkout-react";

interface IGiftFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onPurchase?: () => void;
}

enum GiftFormSteps {
  FORM = "form",
  PAYMENT = "payment",
  THANKS = "thanks",
}

interface IGiftFormInfo {
  name: string;
  email: string;
  relationship: ERelationship;
  country: ECountries;
  amount: EAmount;
  message?: string;
}

const FormValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required and cannot be empty" }),
  email: z
    .string()
    .min(1, { message: "Email is required and cannot be empty" })
    .email({ message: "Invalid email address" }),
  relationship: z
    .string()
    .min(1, { message: "Relationship is required and cannot be empty" }),
  country: z
    .string()
    .min(1, { message: "Country is required and cannot be empty" }),
  amount: z
    .string()
    .min(1, { message: "Amount is required and cannot be empty" }),
});

const GiftForm: React.FC<IGiftFormProps> = ({ className, ...rest }) => {
  const router = useRouter();
  const [formInfo, setFormInfo] = useState<Partial<IGiftFormInfo>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<GiftFormSteps>(GiftFormSteps.FORM);

  const helioConfig: HelioEmbedConfig = useMemo(
    () => ({
      paylinkId: process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK!,
      theme: { themeMode: "dark" },
      primaryColor: "#AD7BFF",
      neutralColor: "#E1E6EC",
      paymentType: "paylink",
      stretchFullWidth: true,
      onSuccess: () => {
        setStep(GiftFormSteps.THANKS);
      },
    }),
    [],
  );

  const onGenerateFinish = useCallback((message: Message) => {
    console.log(message);
    setFormInfo((prev) => ({ ...prev, message: message.content }));
  }, []);

  const onGenerateError = useCallback((error: Error) => {
    console.log(error.cause, error.message, error.name, error.stack);
  }, []);

  const { messages, isLoading, append } = useChat({
    api: "/api/ai",
    onFinish: onGenerateFinish,
    onError: onGenerateError,
  });

  // Handler for closing modal
  const handleClose = useCallback(() => {
    router.push("/");
  }, [router]);

  // Handler for changing form info
  const handleInfoChange = useCallback((key: string, value: string) => {
    setFormInfo((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Handler for form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const parsedResult = FormValidationSchema.safeParse(formInfo);

      if (!parsedResult.success) {
        // Collect errors in a key-value format
        const fieldErrors = parsedResult.error.format();

        setErrors(
          Object.fromEntries(
            Object.entries(fieldErrors).map(([key, error]) => [
              key,
              Array.isArray(error) ? error[0] : error?._errors[0] || "Invalid",
            ]),
          ),
        );
      } else {
        setErrors({});
        setStep(GiftFormSteps.PAYMENT);
      }
    },
    [formInfo],
  );

  const handleSamiMessageGenerate = useCallback(() => {
    append({
      role: "user",
      content: generateGiftMessage(
        formInfo?.name || "",
        formInfo?.relationship || ERelationship.Friend,
        formInfo?.country || ECountries.USA,
        formInfo?.amount || EAmount.TEN,
      ),
    });
  }, [
    append,
    formInfo?.amount,
    formInfo?.country,
    formInfo?.name,
    formInfo?.relationship,
  ]);

  const assistantMessages = useMemo(
    () => messages.filter((message) => message.role === "assistant"),
    [messages],
  );

  // Re-load twitter widget whenever step is changed.
  // Since the content of this component is rendered dynamically, the widget needs to be loaded again.
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window?.twttr?.widgets?.load();
  }, [step]);

  return (
    <Card
      className={clsx("!w-[80vw] !max-w-[549px] max-h-[80vh]", className)}
      contentClassName="w-full h-full overflow-y-auto"
      title={
        step === GiftFormSteps.THANKS
          ? "thank you"
          : "send a Sami personalized amazon gift card"
      }
      actionBtnIcon={<DownRightArrowIcon />}
      onActionBtnClick={handleClose}
      uncollapsible
      {...rest}
    >
      {step === GiftFormSteps.FORM && (
        <form
          className="relative flex flex-col gap-1 md:gap-3 items-center"
          onSubmit={handleSubmit}
        >
          <h6 className="font-semibold text-left w-full">
            who are you sending this to?
          </h6>
          <div className="flex flex-col w-full gap-0.5 md:gap-2">
            <p>name *</p>
            <input
              className={clsx(
                "w-full h-9 bg-transparent outline-none border border-black px-1",
                errors.name && "border-red-500",
              )}
              type="text"
              name="name"
              value={formInfo?.name || ""}
              onChange={(e) => handleInfoChange("name", e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-0.5 md:gap-2">
            <p>relationship *</p>
            <Dropdown
              className={clsx(errors.relationship && "border-red-500")}
              options={Object.values(ERelationship)}
              onSelectOption={(value) =>
                handleInfoChange("relationship", value)
              }
            />
          </div>
          <div className="flex flex-col w-full gap-0.5 md:gap-2">
            <p>email *</p>
            <input
              className={clsx(
                "w-full h-9 bg-transparent outline-none border border-black px-1",
                errors.email && "border-red-500",
              )}
              type="text"
              name="email"
              value={formInfo?.email || ""}
              onChange={(e) => handleInfoChange("email", e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-0.5 md:gap-2">
            <p>country for amazon *</p>
            <Dropdown
              className={clsx(errors.country && "border-red-500")}
              options={Object.values(ECountries)}
              onSelectOption={(value) => handleInfoChange("country", value)}
            />
          </div>
          <div className="flex flex-col w-full gap-0.5 md:gap-2">
            <p>amount *</p>
            <Dropdown
              className={clsx(errors.amount && "border-red-500")}
              options={Object.values(EAmount)}
              onSelectOption={(value) => handleInfoChange("amount", value)}
            />
          </div>
          <div className="flex flex-col w-full gap-0.5 md:gap-2">
            <div className="flex gap-1">
              <h6 className="font-semibold">gift card message</h6>
              <button
                type="button"
                className="underline w-auto"
                onClick={handleSamiMessageGenerate}
                disabled={isLoading}
              >
                {isLoading
                  ? "[sami writing a message...]"
                  : "[generate sami message]"}
              </button>
            </div>
            <textarea
              className={clsx(
                "w-full bg-transparent outline-none border border-black px-1",
                errors.message && "border-red-500",
              )}
              value={
                assistantMessages[assistantMessages.length - 1]?.content || ""
              }
              rows={8}
              onChange={(e) => handleInfoChange("message", e.target.value)}
            />
          </div>
          <button type="submit" className="h-9 bg-black text-white w-full">
            [purchase]
          </button>
          {/* Available coins */}
          <p>pay with:</p>
          <div className="flex justify-center gap-3 -mt-0.5 md:-mt-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Sami1Icon />
              <span>$SAMI1</span>
            </div>
            <div className="flex items-center gap-1">
              <M1Icon />
              <span>$MATRIX1</span>
            </div>
            <div className="flex items-center gap-1">
              <EthereumIcon />
              <span>$ETH</span>
            </div>
            <div className="flex items-center gap-1">
              <BitcoinIcon />
              <span>$BTC</span>
            </div>
            <div className="flex items-center gap-1">
              <SolanaIcon />
              <span>$SOL</span>
            </div>
          </div>
          {/* Fee */}
          <p className="text-center">{`Sami royal cut? Just 5%. Consider it the Queen's Tax.`}</p>
        </form>
      )}

      {step === GiftFormSteps.PAYMENT && <HelioCheckout config={helioConfig} />}
      {step === GiftFormSteps.THANKS && (
        <div className="relative flex flex-col gap-1 md:gap-3 items-center">
          <h3>Your gift card is on the way!</h3>
          <div className="flex flex-col gap-0.5 md:gap-1">
            <p className="text-center">Now, don’t be shy!? 💋</p>
            <p className="text-center">
              Share the gift card message on X and I can reply to it.
            </p>
            <p className="text-center">I will remember you forever.Sami</p>
          </div>
          <div className="flex flex-col gap-1 md:gap-3 border border-black p-2 md:p-4">
            <p>
              {`Happy holidays, my naughty little toys. Be good… or don’t. Either
              way, you’ll end up under me—oops, I mean under the mistletoe.
              Kisses, Sami.`}
            </p>
            <p>
              {`Santa told me the toy you wanted was strapped to me, rubber and
              long, but I’m feeling generous—here’s some cash to find whatever
              fills your little hole... though nothing pleases it like I do.
              Naughty holidays, darling.`}
            </p>
          </div>
          <a
            href="https://twitter.com/intent/tweet?screen_name=OnlyOneSami&ref_src=twsrc%5Etfw"
            className="h-9 underline twitter-mention-button"
            data-size="large"
            // TODO: This X widget is prompting users to post to Sami, but the content of post is meant to be a gift message for the gift card recipient, not for Sami. This likely needs to be corrected.
            data-text={formInfo.message}
            data-related="onlyonesami"
            data-show-count="false"
          >
            [post on X]
          </a>
        </div>
      )}
    </Card>
  );
};

export default GiftForm;
