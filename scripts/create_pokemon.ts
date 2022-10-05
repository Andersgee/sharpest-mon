import "dotenv/config";
import { prisma } from "../src/server/db/client";
import { ALL_MONS } from "../src/utils/mons";

/*
1. add 
"type": "module"
 in package.json

 2. 
 yarn tsnode ./scripts/create_dummydata.ts
*/

async function main() {
  for (let i = 0; i < ALL_MONS.length; i++) {
    const res = await prisma.pokemon.create({
      data: {
        id: i,
      },
    });
    console.log(res);
  }
}

main();
