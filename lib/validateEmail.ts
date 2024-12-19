// blacklist-config.ts
export const BLOCKED_DOMAINS = new Set([
  // Microsoft
  "live.com",
  "msn.com",

  // Yahoo
  "yahoo.com",
  "yahoo.co.th",
  "ymail.com",
  "rocketmail.com",

  // Other Popular Providers
  "aol.com",
  "mail.com",
  "zoho.com",
  "proton.me",
  "protonmail.com",
  "tutanota.com",
  "gmx.com",
  "gmx.net",
]);

export const DISPOSABLE_DOMAINS = new Set([
  // Popular Temporary Email Services
  "tempmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "sharklasers.com",
  "10minutemail.com",
  "throwawaymail.com",
  "tempinbox.com",
  "yopmail.com",
  "trashmail.com",
  "maildrop.cc",
  "temp-mail.org",
  "dispostable.com",
  "tempmailaddress.com",
  "emailondeck.com",
  "tempmail.net",
  "fake-email.com",

  // Russian-based Services
  "mail.ru",
  "yandex.ru",
  "yandex.com",
  "rambler.ru",

  // Testing Domains
  "example.com",
  "test.com",
  "domain.com",
  "sample.com",
]);
interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): EmailValidationResult {
  // 1. ตรวจสอบรูปแบบอีเมล
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(email)) {
    return {
      isValid: false,
      error: "รูปแบบอีเมลไม่ถูกต้อง",
    };
  }

  // 2. แยกโดเมนและตรวจสอบ
  const [, domain] = email.toLowerCase().split("@");

  // 3. ตรวจสอบ blocked domains
  if (BLOCKED_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: "ไม่อนุญาตให้ใช้อีเมลจากผู้ให้บริการนี้",
    };
  }

  // 4. ตรวจสอบ disposable emails
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: "ไม่อนุญาตให้ใช้อีเมลชั่วคราว",
    };
  }

  return { isValid: true };
}
