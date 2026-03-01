/**
 * Utility function to capitalize the first letter of a string
 */
export function capitalizeString(str) {
  if (typeof str !== "string" || str.length === 0) {
    return ""; // Handle invalid or empty input
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}