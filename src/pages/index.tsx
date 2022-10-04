import { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticProps, NextPage } from "next";
import { Head } from "src/components/Head";
import { ThemeToggleButton } from "src/components/ThemeToggleButton";
import { prisma } from "src/server/db/client";
import { ALL_MONS } from "src/utils/mons";

type Props = {
  stats: Stats;
};

const Page: NextPage<Props> = ({ stats }) => {
  return (
    <>
      <Head
        title="Sharpest pokemon"
        description="Which pokemon is sharper?"
        domainUrl="https://sharpest.andyfx.net"
        url="https://sharpest.andyfx.net"
      />
      <ThemeToggleButton />
      <table>
        {stats.map((stat) => (
          <tr key={stat.id} className="">
            <td>{ALL_MONS[stat.id]}</td>
            <td>{stat.percent}%</td>
            <td>for: {stat.votesFor}</td>
            <td>against: {stat.votesAgainst}</td>
          </tr>
        ))}
      </table>
    </>
  );
};

export default Page;

//////////////////////////
// props

export const getStaticProps: GetStaticProps = async () => {
  try {
    const pokemons = await getPokemons();
    const stats = calcStats(pokemons);

    const props: Props = { stats };
    return {
      props,
      revalidate: 10, //at most once every 60 seconds
    };
  } catch (error) {
    throw new Error("something went wrong");
    //return { notFound: true };
  }
};

//////////////////////////
// utils

type Pokemons = inferAsyncReturnType<typeof getPokemons>;

const getPokemons = async () => {
  return await prisma.pokemon.findMany({
    select: {
      id: true,
      _count: {
        select: {
          votesFor: true,
          votesAgainst: true,
        },
      },
    },
  });
};

const percent = (x: number) => Math.round(x * 100);

type Stats = ReturnType<typeof calcStats>;

function calcStats(pokemons: Pokemons) {
  return pokemons
    .map((p) => ({
      id: p.id,
      votesFor: p._count.votesFor,
      votesAgainst: p._count.votesAgainst,
      percent: percent(p._count.votesFor / (p._count.votesFor + p._count.votesAgainst) || 0),
    }))
    .sort((a, b) => b.percent - a.percent);
}
