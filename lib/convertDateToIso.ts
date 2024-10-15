export function convertDateToIso(dateString: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error("รูปแบบวันที่ไม่ถูกต้อง ต้องเป็น YYYY-MM-DD");
  }
  const prismaDateTime = `${dateString}T00:00:00.000Z`;
  return prismaDateTime;
}
