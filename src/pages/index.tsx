import { inferAsyncReturnType } from "@trpc/server";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Head } from "src/components/Head";
import { PokeImage } from "src/components/PokeImage";
import { ThemeToggleButton } from "src/components/ThemeToggleButton";
import { prisma } from "src/server/db/client";
import { randomPageHref } from "src/utils/hashids";
import { ALL_MONS } from "src/utils/mons";

type Props = {
  stats: Stats;
};

const Page: NextPage<Props> = ({ stats }) => {
  const [href, setHref] = useState("");

  useEffect(() => {
    setHref(randomPageHref());
  }, []);

  return (
    <>
      <Head
        title="sharpest-mon"
        description="Who is the sharpest pokemon?"
        domainUrl="https://sharpest.andyfx.net"
        url="https://sharpest.andyfx.net"
        imageUrl="/images/badge45.png"
      />
      <div className="flex justify-end">
        <ThemeToggleButton />
      </div>

      <div className="flex flex-1 justify-center">
        <div className="text-center">
          <h1 className="mb-12">
            <span className="text-lg font-thin italic">The age old question</span>
            <br />
            <span className="text-4xl font-bold">Who is sharper?</span>
          </h1>

          <Link href={href}>
            <a className="inline-block bg-blue-600 p-4 text-lg text-neutral-100 hover:bg-blue-500">
              cast your vote here
            </a>
          </Link>
          <p className="pt-8 text-right">score</p>
          <table className="mx-auto">
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.id} className="border-b-2">
                  <td className="pr-1">
                    <PokeImage id={stat.id} alt={ALL_MONS[stat.id]!} width={48} height={48} />
                  </td>
                  <td className=" text-left capitalize">{ALL_MONS[stat.id]}</td>
                  <td className="text-gray-500">{stat.percent}%</td>
                  <td className="pl-2">
                    ({stat.votesFor}-{stat.votesAgainst})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
      revalidate: 60, //at most once every x seconds
    };
  } catch (error) {
    throw new Error("something went wrong");
    //return { notFound: true };
  }
};

//////////////////////////
// utils

type Pokemons = inferAsyncReturnType<typeof getPokemons>;

async function getPokemons() {
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
}

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
    .sort((a, b) => b.percent - a.percent || b.votesFor - a.votesFor);
}
