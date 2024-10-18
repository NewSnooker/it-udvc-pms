export function convertIsoDateToNormal(
  prismaDate: Date | string | undefined
): string {
  if (prismaDate === undefined) {
    throw new Error("ไม่ได้กําหนดวันที่");
  }
  let dateObject: Date;
  if (typeof prismaDate === "string") {
    dateObject = new Date(prismaDate);
    if (isNaN(dateObject.getTime())) {
      throw new Error("วันที่ไม่ถูกต้อง");
    }
  } else if (prismaDate instanceof Date) {
    dateObject = prismaDate;
  } else {
    throw new Error("วันที่ไม่ถูกต้อง");
  }
  const isoString = dateObject.toISOString();
  const dateString = isoString.split("T")[0];
  return dateString;
}
