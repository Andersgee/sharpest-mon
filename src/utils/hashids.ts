import Hashids from "hashids";
import { clientEnv } from "src/env/schema.mjs";

const hashids = new Hashids(clientEnv.NEXT_PUBLIC_HASHIDS_SALT, 5);

export function hashidFromNumber(n: number) {
  return hashids.encode(n);
}

export function numberFromHashid(s: string) {
  const decoded = hashids.decode(s);
  return decoded[0] as number | undefined;
}
