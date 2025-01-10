/**
 * Converts a UTC date string to a local date string
 * @returns
 */
export function formatLocalDate(input: string): string {
  const date = new Date(input);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  const formattedHours = hours.toString().padStart(2, "0");

  return `${month} ${day}, ${formattedHours}:${minutes}${period}`;
}

/**
 * Converts mentions and hashtags to links
 * @param text
 * @returns
 */
export function convertToLinks(text: string): string {
  const mentionAndHashtagRegex = /([@#])(\w+)/g;

  // Replace each mention or hashtag with a markdown link
  return text.replace(mentionAndHashtagRegex, (match, prefix, word) => {
    if (prefix === "@") {
      // Convert mentions (e.g., @username) to a link to a Twitter profile
      return `[${match}](https://x.com/${word})`;
    } else if (prefix === "#") {
      // Convert hashtags (e.g., #crypto) to a link to a Twitter search page
      return `[${match}](https://x.com/search?q=%23${word})`;
    }

    return match;
  });
}

/**
 * Calculates the number of days between two dates
 */
export function getDaysBetweenDates(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

  // Convert dates to milliseconds
  const date1Ms = date1.getTime();
  const date2Ms = date2.getTime();

  // Calculate the difference in milliseconds
  const differenceMs = date1Ms - date2Ms;

  // Convert back to days and return
  return Math.round(differenceMs / oneDay);
}
