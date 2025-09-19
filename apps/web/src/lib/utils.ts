import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}