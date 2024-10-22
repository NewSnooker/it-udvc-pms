export function generateInvoiceNumber(): string {
  const invoiceNumber = Math.floor(1000000 + Math.random() * 9000000);
  return invoiceNumber.toString();
}
