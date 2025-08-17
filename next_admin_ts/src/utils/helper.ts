/**
 * Format ISO date string into human-readable format
 * @param isoDate - e.g. "2025-08-15T06:58:33.032Z"
 * @param locale - e.g. "en-US"
 * @returns formatted date string
 */
export function formatDate(
  isoDate: string,
  format: 'DD/MM/YYYY' | 'MM-DD-YYYY' | 'YYYY/MM/DD' = 'DD/MM/YYYY',
): string {
  if (!isoDate) return '';

  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = date.getFullYear();

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM-DD-YYYY':
      return `${month}-${day}-${year}`;
    case 'YYYY/MM/DD':
      return `${year}/${month}/${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
}
