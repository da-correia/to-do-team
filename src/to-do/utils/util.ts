/**
 * Converts snake_case string to regular words
 * @example "projected_balance_after" -> "Projected Balance After"
 */
export function snakeToWords(str: string) {
  if (!str) return "";
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts regular words to snake_case
 * @example "Projected Balance After" -> "projected_balance_after"
 */
export function wordsToSnake(str: string) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/[\s-]+/) // split by space or dash
    .filter(Boolean)
    .join("_");
}
