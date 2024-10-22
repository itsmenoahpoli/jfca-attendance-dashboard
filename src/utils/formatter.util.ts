import { format, parseISO } from "date-fns";

export const slugify = (string?: string) => {
  if (!string) return;

  return string.replaceAll(" ", "").toLowerCase();
};

export const formatDate = (date: string, dateFormat: string = "MMMM do, yyyy hh:mm a") => {
  const parsedDate = parseISO(date);

  return format(parsedDate, dateFormat);
};

export const getInitials = (str: string): string => {
  return str
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0))
    .join("");
};
