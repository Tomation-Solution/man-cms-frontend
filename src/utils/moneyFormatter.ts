export function formatMoney(number: string) {
  return Number(number)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
}
