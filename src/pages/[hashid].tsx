import { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Head } from "src/components/Head";
import { PokemonVoter } from "src/components/PokemonVoter";
import { ThemeToggleButton } from "src/components/ThemeToggleButton";
import { prisma } from "src/server/db/client";
import { hashidFromNumber, numberFromHashidParam } from "src/utils/hashids";
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

  const text0 = "In this particular comparison, you are the first!";
  const text1 = `In this particular comparison, ${stats.percentForAWhenBoth}% of votes went to ${pokemonA.name}.`;
  const text2 = `In this particular comparison, ${stats.percentForBWhenBoth}% of votes went to ${pokemonB.name}.`;
  const text3 = "In this particular comparison, its dead even.";

  return (
    <>
      <Head
        title="Sharpest-mon"
        description={`Who is sharper? ${pokemonA.name} vs ${pokemonB.name}. ${
          stats.percentForAWhenBoth > stats.percentForBWhenBoth
            ? `${pokemonA.name} is winning.`
            : `${pokemonB.name} is winning.`
        }`}
        domainUrl="https://sharpest.andyfx.net"
        url={`https://sharpest.andyfx.net/${hashidFromNumber(pageId)}`}
        imageUrl={
          stats.percentForAWhenBoth > stats.percentForBWhenBoth
            ? `/pokemon/${pokemonA.id + 1}.png`
            : `/pokemon/${pokemonB.id + 1}.png`
        }
      />
      <div className="flex justify-end">
        <ThemeToggleButton />
      </div>

      <div className="flex justify-center text-center">
        <div>
          <h1 className="mb-8">
            <span className="text-lg font-thin italic">Who is sharper?</span>
            <br />
            <span className="text-4xl font-bold">
              {pokemonA.name} <span className="px-2 text-xl">vs</span> {pokemonB.name}
            </span>
          </h1>
          <div className="flex justify-center">
            <PokemonVoter pageId={pageId} pokemonA={pokemonA} pokemonB={pokemonB} />
          </div>

          <p className="mt-8 border-b-2 py-4">Click on a pokemon!</p>
          <p className="mt-2">
            {stats.percentForAWhenBoth === 0 && stats.percentForBWhenBoth === 0 && text0}
            {stats.percentForAWhenBoth > stats.percentForBWhenBoth && text1}
            {stats.percentForAWhenBoth < stats.percentForBWhenBoth && text2}
            {stats.percentForAWhenBoth === stats.percentForBWhenBoth &&
              (stats.percentForAWhenBoth > 0 || stats.percentForBWhenBoth > 0) &&
              text3}
          </p>
          <Link href="/">
            <a className="mt-10 inline-block bg-blue-600 p-4 text-lg text-neutral-100 hover:bg-blue-500">
              see all results here
            </a>
          </Link>
        </div>
      </div>
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

const percent = (x: number) => Math.round(x * 100);

type Stats = ReturnType<typeof calcStats>;

function calcStats(votes: Votes) {
  const idA = votes.votesPokeA?.id;
  const idB = votes.votesPokeB?.id;

  const votesForA = votes.votesPokeA?.votesFor.length || 0;
  const votesForB = votes.votesPokeB?.votesFor.length || 0;
  const votesForAWhenBoth = votes.votesPokeA?.votesFor.filter((x) => x.againstPokemonId === idB).length || 0;
  const votesForBWhenBoth = votes.votesPokeB?.votesFor.filter((x) => x.againstPokemonId === idA).length || 0;

  const percentForAWhenBoth = percent(votesForAWhenBoth / (votesForAWhenBoth + votesForBWhenBoth) || 0);
  const percentForBWhenBoth = percent(votesForBWhenBoth / (votesForAWhenBoth + votesForBWhenBoth) || 0);

  return { votesForA, votesForB, votesForAWhenBoth, votesForBWhenBoth, percentForAWhenBoth, percentForBWhenBoth };
}
