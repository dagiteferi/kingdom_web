import { format } from 'date-fns';

export const safeParseDate = (dateVal: string | Date | undefined | null): Date | null => {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal;

  // Try direct parse
  let d = new Date(dateVal);
  if (!isNaN(d.getTime())) return d;

  // Fix ISO strings with space instead of T for iOS Safari: "2025-01-01 12:00:00" -> "2025-01-01T12:00:00"
  if (typeof dateVal === 'string') {
    const isoFormatted = dateVal.replace(' ', 'T');
    d = new Date(isoFormatted);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
};

/**
 * Safely formats a date using date-fns without throwing RangeError on iOS.
 */
export const safeFormatDate = (
  dateVal: string | Date | undefined | null,
  formatStr: string,
  fallback = ''
): string => {
  const parsed = safeParseDate(dateVal);
  if (!parsed) return fallback;
  try {
    return format(parsed, formatStr);
  } catch (err) {
    return fallback;
  }
};
