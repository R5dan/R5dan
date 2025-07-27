"use client";

import { useEffect } from "react";
import { posthog } from "posthog-js";

// export function Redirect(props: { id: string }) {
//   const { id } = props;
//   const res = await fetch()
//   const { url } = api.redirect.get.useQuery({ id });

//   useEffect(() => {
//     if (url && !isLoading) {
//       console.log(`[REDIRECT] ${id} > ${url}`);
//       posthog.capture("REDIRECT", { id: id, url: url });
//       window.location.replace(url);
//     }
//   }, [url, isLoading, id]);

//   if (error) {
//     console.error(error?.message);
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
//         <div className="text-center">
//           <h1 className="mb-4 text-2xl font-bold">Redirect Not Found</h1>
//           <p className="text-white/80">
//             The requested redirect could not be found.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
//         <div className="text-center">
//           <h1 className="mb-4 text-2xl font-bold">Redirecting...</h1>
//           <p className="text-white/80">Please wait while we redirect you.</p>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }
