import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateUniqueLink = () => {
  return `${window.location.origin}/game/${Math.random().toString(36).substr(2, 9)}`;
};
