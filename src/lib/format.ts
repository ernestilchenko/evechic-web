const priceFormatter = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });

export function formatPrice(value: string | number) {
  return `${priceFormatter.format(Number(value))} ₴`;
}

export function formatSizes(sizes: readonly string[]) {
  return sizes.join(" · ");
}

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
) {
  return new Intl.DateTimeFormat("uk-UA", options).format(new Date(value));
}
