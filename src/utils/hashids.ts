import Hashids from "hashids";
import { clientEnv } from "src/env/schema.mjs";
import { N_MONS } from "./mons";

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

export function randomPageHref(): string {
  const a = Math.floor(Math.random() * N_MONS);
  const b = Math.floor(Math.random() * N_MONS);
  if (a === b) return randomPageHref();

  const id = a * N_MONS + b;
  const hashid = hashids.encode(id);
  return `/${hashid}`;
}

export function generatePagePaths() {
  const ids: number[] = [];
  for (let i = 0; i < N_MONS; i++) {
    for (let j = 0; j < N_MONS; j++) {
      if (i !== j) ids.push(i * N_MONS + j);
    }
  }
  const paths = ids.map((id) => ({ params: { hashid: hashids.encode(id) } }));

  return paths;
}
