"use client";

import React, { useCallback, useState } from "react";
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

interface IGiftFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onPurchase?: () => void;
}

enum ERelationship {
  Friend = "Friend",
  Family = "Family",
  Partner = "Partner",
  Colleague = "Colleague",
  Other = "Other",
}

enum ECountries {
  USA = "United States",
  CANADA = "Canada",
  EUROPE = "Europe",
  UNITED_KINGDOM = "United Kingdom",
}

enum EAmount {
  FIVE = "5",
  TWENTY = "20",
  FIFTY = "50",
  HUNDRED = "100",
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
        // TODO: Submit
      }
    },
    [formInfo],
  );

  // Handler for generating sami message
  const handleSamiMessageGenerate = useCallback(() => {
    // TODO: generate sami message
  }, []);

  return (
    <Card
      className={clsx("!w-[80vw] !max-w-[549px] max-h-[80vh]", className)}
      contentClassName="w-full h-full overflow-y-auto"
      title="send a Sami personalized amazon gift card"
      actionBtnIcon={<DownRightArrowIcon />}
      onActionBtnClick={handleClose}
      uncollapsible
      {...rest}
    >
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
            onSelectOption={(value) => handleInfoChange("relationship", value)}
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
          <h6 className="font-semibold">gift card message</h6>
          <textarea
            className={clsx(
              "w-full bg-transparent outline-none border border-black px-1",
              errors.message && "border-red-500",
            )}
            value={formInfo?.message || ""}
            rows={4}
            onChange={(e) => handleInfoChange("message", e.target.value)}
          />
        </div>
        <button
          type="button"
          className="underline w-auto"
          onClick={handleSamiMessageGenerate}
        >
          [generate sami message]
        </button>
        <button type="submit" className="h-9 bg-black text-white w-full">
          [purchase]
        </button>
        {/* Available coins */}
        <div className="flex justify-center gap-3 -mt-0.5 md:-mt-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Sami1Icon />
            <span>$Sami1</span>
          </div>
          <div className="flex items-center gap-1">
            <M1Icon />
            <span>$Matrix1</span>
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
            <span>$Sol</span>
          </div>
        </div>
        {/* Fee */}
        <p>{`Sami royal cut? Just 5%. Consider it the Queen's Tax.`}</p>
      </form>
    </Card>
  );
};

export default GiftForm;
