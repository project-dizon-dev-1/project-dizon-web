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

export { cn, getInitial };
