import Blog from "./blog"

export default async function Page({
  params,
}: {
  params: Promise<{ url: string }>
}) {
  const { url } = await params
  console.log("URL", url);
  return <Blog url={url} />;
}