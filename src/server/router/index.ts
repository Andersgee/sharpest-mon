// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { voteRouter } from "./vote";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("vote.", voteRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
