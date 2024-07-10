import { COLOR_SCHEMES } from "@/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomColorTheme() {
  return COLOR_SCHEMES[Math.floor(Math.random() * (COLOR_SCHEMES.length + 1))];
}

export function formatPrice(price: number) {
  let parsedPrice;
  if (typeof price !== "number") {
    parsedPrice = parseFloat(price);
  } else {
    parsedPrice = price;
  }
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(parsedPrice);
}
