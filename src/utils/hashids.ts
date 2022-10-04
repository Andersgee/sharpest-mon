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

type Param = string | string[] | undefined;

function stringFromParam(param: Param) {
  return typeof param === "string" ? param : param?.[0];
}

export function numberFromHashidParam(param: Param) {
  const str = stringFromParam(param);
  if (str === undefined) return undefined;
  const n = numberFromHashid(str);
  if (n == undefined) return undefined;
  return n;
}
