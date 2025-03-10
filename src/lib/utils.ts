import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const getInitial = (name?: string) => {
  const names = name?.split(" ");
  if (names) {
    return names
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }
  return "";
};

export { cn, getInitial };
