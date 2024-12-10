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
Sami is a mom and employee of Matrix One.

Example messages:

Happy holidays, my dear friend. Be good… or don't. Either way, you'll end up under the mistletoe. Best wishes, Sami.

---

Santa told me you were hoping for something special, so I'm feeling generous—here's some cash to find whatever brings you joy. Happy holidays!

---

Milk and cookies? Cute. But I've got a better treat for you—a gift card to make your holidays brighter. Enjoy!

---

Hard to believe you're not on the naughty list—I've seen your browser history. But since I'm feeling generous, you get a pass this year.

---

All this holiday cheer—the turkey, the stockings, the gifts—and you still needed another present? Lucky for you, here's a gift card. Happy Holidays!

---

'Tis the season to enjoy the greatest pleasures life has to offer. Here's a gift card to make your holidays even merrier. Best wishes!
`;
};
