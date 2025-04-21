import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : int;
};

// PROMPT: [ChatGTP] create toSlug ts arrow function that convert text to lowercase, remove non-word, non-whitespace, non-hyphen characters, replace whitespace, trim leading hyphens and trim trailing hyphens
export function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

// Ex: console.log(formatCurrency(1000)); => "$1,000.00" OR console.log(formatCurrency(4)); => "$4.00"
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2, // Ensures two decimal places.
});
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// Intl.NumberFormat is a built-in JavaScript object that formats numbers according to locale-specific rules.
// No extra options → Uses default formatting (adds commas for thousands).
// Ex: console.log(formatNumber(1234.56)); => "1,234.56" OR   console.log(formatNumber(50)); => "50"
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const generateId = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join("");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any): string => {
  if (error.name === "ZodError") {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message;
      return `${error.errors[field].path}: ${errorMessage}`; // field: errorMessage
    });
    return fieldErrors.join(". ");
  } else if (error.name === "ValidationError") {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      const errorMessage = error.errors[field].message;
      return errorMessage;
    });
    return fieldErrors.join(". ");
  } else if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue)[0];
    return `${duplicateField} already exists`;
  } else {
    // return 'Something went wrong. please try again'
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
};

export function calculateFutureDate(days: number) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate;
  // EX:
  // const currentDate = new Date();  >> currentDate: 2025-03-31T18:48:47.945Z
  // currentDate.setDate(currentDate.getDate() + 20);
  // console.log('newDate:', currentDate.toDateString()); >> newDate: Sun Apr 20 2025
}
export function getMonthName(yearAndMonth: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [year, monthNumber] = yearAndMonth.split("-");
  const date = new Date();
  // parseInt is a JavaScript function used to convert a string into an integer. Ex '0025' > 25
  // parseInt(monthNumber) - 1 → Converts "03" to 2, because months in JavaScript are zero-based (0 = January, 1 = February, 2 = March).
  // date.setMonth(2) → Sets the date object to March.
  date.setMonth(parseInt(monthNumber) - 1);
  return new Date().getMonth() === parseInt(monthNumber) - 1
    ? `${date.toLocaleString("default", { month: "long" })} (ongoing)`
    : date.toLocaleString("default", { month: "long" });
}
export function calculatePastDate(days: number) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - days);
  return currentDate;
}
export function timeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // Set to 12:00 AM (next day)

  const diff = midnight.getTime() - now.getTime(); // midnight.getTime() returns the timestamp of midnight (next day) in milliseconds.
  const hours = Math.floor(diff / (1000 * 60 * 60)); // Convert milliseconds to hours
  // diff % (1000 * 60 * 60) gets the remaining milliseconds after removing full hours.
  // Dividing by (1000 * 60) converts the remaining milliseconds into minutes.
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
}

export const formatDateTime = (dateString: Date) => {
  // This function formats a given date into a readable string using internationalization (Intl.DateTimeFormat).
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // "numeric" → Displays the full year (2024, 2025, etc.).
    day: "numeric", // "numeric" → Displays the day of the month (1 to 31).
    hour: "numeric", // "numeric" → Displays the hour (1-12 if hour12: true, 0-23 if false).
    minute: "numeric", // "numeric" → Displays the minutes (00-59).
    hour12: true, // hour12: true, // 12-hour format (AM/PM)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    // weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const getFilterUrl = ({
  params,
  category,
  tag,
  sort,
  price,
  rating,
  page,
}: {
  params: {
    q?: string;
    category?: string;
    tag?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  };
  tag?: string;
  category?: string;
  sort?: string;
  price?: string;
  rating?: string;
  page?: string;
}) => {
  const newParams = { ...params };
  if (category) newParams.category = category;
  if (tag) newParams.tag = toSlug(tag);
  if (price) newParams.price = price;
  if (rating) newParams.rating = rating;
  if (page) newParams.page = page;
  if (sort) newParams.sort = sort;
  return `/search?${new URLSearchParams(newParams).toString()}`;
};
