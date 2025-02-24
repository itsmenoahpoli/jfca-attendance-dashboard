export const FORMATTERS = {
  slugifyString(value: string) {
    if (!value) return "";

    return value.toLowerCase().trim().replaceAll(" ", "-");
  },

  getInitials(value?: string) {
    if (!value) return "";
    if (value.trim().length === 0) return value.charAt(0);

    return value
      .trim()
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word[0].toUpperCase())
      .join("");
  },
};
