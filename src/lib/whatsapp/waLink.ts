const DIGITS_ONLY = /\D/g;

export function buildWaLink(phoneNumber: string, message: string) {
  const digits = phoneNumber.replace(DIGITS_ONLY, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
