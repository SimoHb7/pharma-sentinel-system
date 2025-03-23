
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday } from "date-fns";

// Combine Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return `Today, ${format(date, "h:mm a")}`;
  }
  
  if (isYesterday(date)) {
    return `Yesterday, ${format(date, "h:mm a")}`;
  }
  
  return format(date, "MMM d, yyyy");
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Generate random ID for new entities
export function generateId(prefix: string): string {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}

// Check if item is expiring soon (within 30 days)
export function isExpiringSoon(expiryDate: string): boolean {
  const expiry = new Date(expiryDate);
  const today = new Date();
  
  // Calculate difference in days
  const differenceInTime = expiry.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  return differenceInDays <= 30 && differenceInDays > 0;
}

// Check if item is low in stock (below 10 units)
export function isLowStock(stock: number): boolean {
  return stock <= 10;
}

// Create alert message for expiring medication
export function createExpiryAlertMessage(expiryDate: string): string {
  const expiry = new Date(expiryDate);
  const today = new Date();
  
  const differenceInTime = expiry.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  return `Expires in ${differenceInDays} days`;
}
