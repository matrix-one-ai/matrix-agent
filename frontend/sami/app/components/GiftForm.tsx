"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useTweetWidget } from "@/app/hooks/useTweetWidget";

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

const mapCountryToPaylink = (country: ECountries, amount: string) => {
  switch (country) {
    case ECountries.USA:
      return amount === EAmount.TEN
        ? process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_10_USD!
        : process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_50_USD!;
    case ECountries.CANADA:
      return amount === EAmount.TEN
        ? process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_10_CAD!
        : process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_50_CAD!;
    // case ECountries.EUROPE:
    //   return amount === EAmount.TEN
    //     ? process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_10_EUR!
    //     : process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_50_EUR!;
    case ECountries.UNITED_KINGDOM:
      return amount === EAmount.TEN
        ? process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_10_GBP!
        : process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_50_GBP!;
    default:
      return amount === EAmount.TEN
        ? process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_10_USA!
        : process.env.NEXT_PUBLIC_HELIO_GIFTCARD_PAYLINK_50_USA!;
  }
};

const GiftForm: React.FC<IGiftFormProps> = ({ className, ...rest }) => {
  const router = useRouter();
  const [formInfo, setFormInfo] = useState<Partial<IGiftFormInfo>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<GiftFormSteps>(GiftFormSteps.FORM);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useTweetWidget([step]);

  const helioConfig: HelioEmbedConfig = useMemo(
    () => ({
      paylinkId: mapCountryToPaylink(
        formInfo.country || ECountries.USA,
        formInfo.amount || EAmount.TEN,
      ),
      theme: { themeMode: "dark" },
      primaryColor: "#AD7BFF",
      neutralColor: "#E1E6EC",
      paymentType: "paylink",
      stretchFullWidth: true,
      additionalJSON: JSON.stringify({
        toEmail: formInfo.email,
        amount: formInfo.amount,
        giftMessage: formInfo.message,
        country: formInfo.country,
      }),
      onSuccess: () => {
        setStep(GiftFormSteps.THANKS);
      },
    }),
    [formInfo.amount, formInfo.country, formInfo.email, formInfo.message],
  );

  const onGenerateFinish = useCallback((message: Message) => {
    console.log(message);
    setFormInfo((prev) => ({ ...prev, message: message.content }));
  }, []);

  const onGenerateError = useCallback((error: Error) => {
    console.log(error.cause, error.message, error.name, error.stack);
  }, []);

  const { messages, setMessages, isLoading, append } = useChat({
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

  useEffect(() => {
    if (messages.length === 0) return;

    const assistantMessages = messages.filter(
      (message) => message.role === "assistant",
    );

    // Update local state
    handleInfoChange(
      "message",
      assistantMessages[assistantMessages.length - 1]?.content || "",
    );
    // Reset ai-generated messages
    setMessages([]);
  }, [handleInfoChange, messages, setMessages]);

  // Adjust textarea height to fit content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formInfo.message]);

  return (
    <Card
      className={clsx("!w-[80vw] !max-w-[549px]", className)}
      contentClassName="w-full h-full overflow-y-auto mb-8"
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
                "w-full h-9 bg-transparent outline-none border border-black px-4",
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
                "w-full h-9 bg-transparent outline-none border border-black px-4",
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
          <div className="flex flex-col w-full gap-0.5 md:gap-2 mt-1 md:mt-3">
            <div className="flex justify-between">
              <h6 className="font-semibold">gift card message</h6>
              <button
                type="button"
                className="underline w-auto"
                onClick={handleSamiMessageGenerate}
                disabled={isLoading}
              >
                {isLoading
                  ? "[sami writing a message...]"
                  : "[generate a message from sami]"}
              </button>
            </div>
            <textarea
              ref={textareaRef}
              className={clsx(
                "w-full bg-transparent outline-none border border-black p-4 overflow-hidden resize-none",
                errors.message && "border-red-500",
              )}
              value={formInfo?.message || ""}
              onChange={(e) => handleInfoChange("message", e.target.value)}
            />
          </div>
          {/* Available coins */}
          <p className="mt-1">pay with:</p>
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
          <button type="submit" className="h-9 bg-black text-white w-full mt-3">
            [purchase]
          </button>
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
            href="https://twitter.com/intent/tweet?screen_name=x&ref_src=twsrc%5Etfw"
            className="twitter-mention-button"
            data-size="large"
            data-text={formInfo.message}
            data-related="onlyonesami"
            data-show-count="false"
            target="_blank"
          />
        </div>
      )}
    </Card>
  );
};

export default GiftForm;
