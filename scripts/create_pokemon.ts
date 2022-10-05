import "dotenv/config";
import { prisma } from "../src/server/db/client";
import { ALL_MONS } from "../src/utils/mons";

/**
 * must have "type": "module" in package.json
 * also see package.json script tsnode
 * ```sh
 * yarn tsnode ./scripts/create_pokemon.ts
 * ```
 */
async function main() {
  /*
  for (let i = 0; i < ALL_MONS.length; i++) {
    const res = await prisma.pokemon.create({
      data: {
        id: i,
      },
    });
    console.log(res);
  }
  */
  const pokemondata = ALL_MONS.map((_, i) => ({ id: i }));
  const res = await prisma.pokemon.createMany({ data: pokemondata });
  console.log(res);
}

main();
