import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@r5dan/api/routers/index";

export const client = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "http://localhost:3000/trpc",
			// You can pass any HTTP headers you wish here
		}),
	],
});
