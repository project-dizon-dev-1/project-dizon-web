import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const getInitial = (name?: string | object | null) => {
  // Check if name is a string before attempting to split
  if (typeof name !== "string" || !name) {
    return "";
  }

  const names = name.split(" ");
  return names
    .map((name) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

// Helper function for ordinal suffixes (1st, 2nd, 3rd, etc.)
const getDaySuffix = (day: number): string => {
  switch (day) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
// Format amount with currency symbol
const formatAmount = (amount: number) => {
  return `₱${amount.toLocaleString("en-PH")}`;
};

export { cn, getInitial, getDaySuffix, formatDate, formatAmount };
