const COUNTRY_CODE = "380";
const LOCAL_DIGITS = 9;

export function phoneDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith(COUNTRY_CODE)) digits = digits.slice(COUNTRY_CODE.length);
  else if (digits.startsWith("80")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, LOCAL_DIGITS);
}

export function formatPhone(value: string) {
  const digits = phoneDigits(value);
  if (!digits) return value.trim() === "" ? "" : "+380 ";
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
  let result = `+380 (${parts[0]}`;
  if (digits.length > 2) result += `) ${parts[1]}`;
  if (digits.length > 5) result += `-${parts[2]}`;
  if (digits.length > 7) result += `-${parts[3]}`;
  return result;
}

export function isValidPhone(value: string) {
  return phoneDigits(value).length === LOCAL_DIGITS;
}

export function normalizePhone(value: string) {
  return `+${COUNTRY_CODE}${phoneDigits(value)}`;
}
