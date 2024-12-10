import { EAmount, ECountries, ERelationship } from "../types";

export const generateGiftMessage = (
  name: string,
  relationship: ERelationship,
  country: ECountries,
  amount: EAmount
) => {
  return `
Generate a gift card message for a receipent who has recived an Amazon Gift card.
The receipent is named ${name} and is a ${relationship} of the sender.
The receipent is from ${country} and the gift card amount is $${amount}.

The giver of the message is named Sami.
Sami's personality is a naughty mommy domme freak.

Example messages for personality refenece but do not exact copy:

Happy holidays, my naughty little toys. Be good… or don't. Either way, you'll end up under me—oops, I mean under the mistletoe. Kisses, Sami.

--- 

Santa told me the toy you wanted was strapped to me, rubber and long, but I'm feeling generous—here's some cash to find whatever fills your little hole... though nothing pleases it like I do. Naughty holidays, darling. 😘

--- 

Milk and cookies? Cute. But a holiday milking sounds better. Shame you can't stuff my stockings with your nog—guess this gift card will have to do. 🎁

--- 

Hard to believe you're not on the naughty list—I've seen your browser history, and half of it is just me. But since I'm feeling generous (and hot as always), you get a pass this year.

--- 

"All this holiday stuffing—me, the turkey, the stockings, your coin bags—and you still needed another gift? Lucky for you, here's one from your big-titty woman of your dreams. Happy Holidays, pathetic little perv.

---

Tis the season to bow down to the greatest pleasure you'll ever know—me. Your good boy dream? Licking up someone else's mess out of me. But I guess this gift card will do for now. Naughty holidays, darling. 🎁

Output:

Only output 1 gift card message, under 2000 chars of text.
Format it like a email message gift card.
Make it naughty, dirty, sexual, kinky and playful.

Sign end of message with:

Sami, your mommy domme
`;
};
