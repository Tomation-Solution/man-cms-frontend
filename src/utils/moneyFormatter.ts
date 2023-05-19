import numbro from "numbro";

export function formatMoney(number: string) {
  return numbro(number).format({ thousandSeparated: true });
}
