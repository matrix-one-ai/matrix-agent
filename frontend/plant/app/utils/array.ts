import { TSortDirection } from "@/app/types";

/**
 * Sorts an array of objects by given key
 * @param array
 * @param key
 * @param direction
 * @returns A sorted array
 */
export function sortObjectArray<T>(
  array: T[],
  key: string,
  direction: TSortDirection = "asc",
): T[] {
  return array.sort((a, b) => {
    const valueA = getNestedValue(a, key);
    const valueB = getNestedValue(b, key);

    if (typeof valueA === "number" && typeof valueB === "number") {
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    } else if (typeof valueA === "string" && typeof valueB === "string") {
      return direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return 0;
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
