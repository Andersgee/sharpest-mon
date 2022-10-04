import { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Head } from "src/components/Head";
import { PokemonVoter } from "src/components/PokemonVoter";
import { ThemeToggleButton } from "src/components/ThemeToggleButton";
import { prisma } from "src/server/db/client";
import { numberFromHashidParam } from "src/utils/hashids";
import { ALL_MONS, N_MONS, type Pokemon } from "src/utils/mons";

type Props = {
  pageId: number;
  pokemonA: Pokemon;
  pokemonB: Pokemon;
  stats: Stats;
};

const Page: NextPage<Props> = ({ pageId, pokemonA, pokemonB, stats }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>fallback</div>;
  }

  return (
    <>
      <Head
        title="Sharpest pokemon"
        description="Which pokemon is sharper?"
        domainUrl="https://sharpest.andyfx.net"
        url="https://sharpest.andyfx.net"
      />
      <ThemeToggleButton />
      <PokemonVoter pageId={pageId} pokemonA={pokemonA} pokemonB={pokemonB} />
      <div>stats: {JSON.stringify(stats)}</div>
      <Link href="/">
        <a>view results</a>
      </Link>
    </>
  );
};

export default Page;

//////////////////////////
// props

export const getStaticPaths: GetStaticPaths = async () => {
  //return { paths: generatePagePaths(), fallback: false };
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const p = pokemonsFromHashid(params?.hashid);
    if (!p) return { notFound: true };

    const votes = await getVotes(p.pokemonA.id, p.pokemonB.id);

    const stats = calcStats(votes);
    const props: Props = { pageId: p.n, pokemonA: p.pokemonA, pokemonB: p.pokemonB, stats };
    return {
      props,
      revalidate: 10, //at most once every 10 seconds
    };
  } catch (error) {
    throw new Error("something went wrong");
    //return { notFound: true };
  }
};

//////////////////////////
// utils

type Param = string | string[] | undefined;

function pokemonsFromHashid(param: Param) {
  const n = numberFromHashidParam(param);
  if (n === undefined) return undefined;

  const a = n % N_MONS;
  const b = Math.floor(n / N_MONS);

  const nameA = ALL_MONS[a];
  const nameB = ALL_MONS[b];
  if (!nameA || !nameB) return undefined;

  const pokemonA: Pokemon = {
    id: a,
    name: nameA,
  };
  const pokemonB: Pokemon = {
    id: b,
    name: nameB,
  };

  return { n, pokemonA, pokemonB };
}

type Votes = inferAsyncReturnType<typeof getVotes>;

async function getVotes(a: number, b: number) {
  const votesPokeA = await prisma.pokemon.findUnique({
    where: { id: a },
    include: {
      votesFor: {
        select: {
          againstPokemonId: true,
        },
      },
      votesAgainst: {
        select: {
          forPokemonId: true,
        },
      },
    },
  });
  const votesPokeB = await prisma.pokemon.findUnique({
    where: { id: b },
    include: {
      votesFor: {
        select: {
          againstPokemonId: true,
        },
      },
      votesAgainst: {
        select: {
          forPokemonId: true,
        },
      },
    },
  });
  return { votesPokeA, votesPokeB };
}

type Stats = ReturnType<typeof calcStats>;

function calcStats(votes: Votes) {
  const idA = votes.votesPokeA?.id;
  const idB = votes.votesPokeB?.id;

  const votesForA = votes.votesPokeA?.votesFor.length || 0;
  const votesForB = votes.votesPokeB?.votesFor.length || 0;
  const votesForAWhenBoth = votes.votesPokeA?.votesFor.filter((x) => x.againstPokemonId === idB).length || 0;
  const votesForBWhenBoth = votes.votesPokeB?.votesFor.filter((x) => x.againstPokemonId === idA).length || 0;
  return { votesForA, votesForB, votesForAWhenBoth, votesForBWhenBoth };
}
