export default async function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <div className="">{id}</div>;
}
