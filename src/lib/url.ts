export function getAbsoluteUrl(path: string) {
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  return new URL(path, origin).toString();
}
