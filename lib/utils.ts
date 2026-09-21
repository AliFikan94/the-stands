// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFanId(id: string) {
  return id.startsWith('0x') ? `${id.slice(0, 6)}...${id.slice(-4)}` : id
}