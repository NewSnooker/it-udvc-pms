export function generateSlug(title: string): string {
  // Convert title to lowercase, replace spaces with dashes
  let slug = title.trim().toLowerCase().replace(/\s+/g, "-");

  // Remove special characters except for dashes and Thai characters
  slug = slug.replace(/[^\w\-ก-๙]/g, "");

  // Encode any remaining unsafe characters for URL compatibility
  return encodeURIComponent(slug);
}
