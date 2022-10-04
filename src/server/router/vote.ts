import { createRouter } from "./context";
import { z } from "zod";

export const voteRouter = createRouter().mutation("create", {
  input: z.object({
    votedFor: z.number(),
    votedAgainst: z.number(),
  }),
  async resolve({ ctx, input }) {
    return await ctx.prisma.vote.create({
      data: {
        forPokemonId: input.votedFor,
        againstPokemonId: input.votedAgainst,
      },
    });
  },
});
