/**
 * Extract date and time from an ISO string
 * @param timestamp
 * @returns
 */
export function formatTimestampToLocal(timestamp: string): {
  date: string;
  time: string;
} {
  const dateObj = new Date(timestamp); // Convert the ISO string to a Date object

  // Extract and format the date
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "long" }); // e.g., "November"
  const year = dateObj.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  // Extract and format the time
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  return { date: formattedDate, time: formattedTime };
}
