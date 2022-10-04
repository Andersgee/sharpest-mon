import { createRouter } from "./context";
import { z } from "zod";

export const voteRouter = createRouter().mutation("create", {
  input: z.object({
    forPokemonId: z.number(),
    againstPokemonId: z.number(),
  }),
  async resolve({ ctx, input }) {
    return await ctx.prisma.vote.create({
      data: {
        forPokemonId: input.forPokemonId,
        againstPokemonId: input.againstPokemonId,
      },
    });
  },
});
