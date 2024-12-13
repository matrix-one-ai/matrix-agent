import { NextResponse } from "next/server";
import { Resend } from "resend";
import EmailTemplate from "../../components/EmailTemplate";

export const maxDuration = 30;
export const revalidate = 0;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { toEmail, subject, giftMessage, amount, currency, redeemCode } =
      await req.json();

    const { data, error } = await resend.emails.send({
      from: "Sami <sami@sami.one>",
      to: [toEmail],
      subject: subject,
      react: EmailTemplate({
        giftMessage,
        amount,
        currency,
        redeemCode,
      }),
    });

    if (error) {
      console.log(error);
      return NextResponse.json({ error: error }, { status: 500 });
    }

    return NextResponse.json({ data: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
