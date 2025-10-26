import { Suspense } from "react";
import {Page} from "./mainPage";


export default async function Wrapper({
  params,
}: {
  params: Promise<{ url: string }>;
}) {
  return (
    <Suspense fallback={"Loading..."}>
      <Page params={params} />
    </Suspense>
  );
}