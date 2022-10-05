import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { randomPageHref } from "src/utils/hashids";
import { Pokemon } from "src/utils/mons";
import { trpc } from "src/utils/trpc";
import { PokeImage } from "./PokeImage";

type Props = {
  pageId: number;
  pokemonA: Pokemon;
  pokemonB: Pokemon;
};

export function PokemonVoter({ pageId, pokemonA, pokemonB }: Props) {
  const router = useRouter();
  const vote = trpc.useMutation(["vote.create"]);
  const [href, setHref] = useState("");

  useEffect(() => {
    const newHref = randomPageHref(pageId);
    //console.log(`setting newHref: ${newHref}`);
    setHref(newHref);
  }, [pageId]);

  useEffect(() => {
    if (href) {
      //console.log(`prefetching href: ${href}`);
      router.prefetch(href);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [href]);

  const onClick = (forPokemonId: number, againstPokemonId: number) => () => {
    vote.mutate({ forPokemonId, againstPokemonId });
    router.push(href);
  };

  return (
    <div className="flex">
      <button
        className="hover:bg-white hover:shadow-md hover:dark:bg-neutral-800 hover:dark:shadow-sm hover:dark:shadow-black"
        onClick={onClick(pokemonA.id, pokemonB.id)}
      >
        <PokeImage id={pokemonA.id} alt={pokemonA.name} width={192} height={192} />
      </button>

      <button
        className="hover:bg-white hover:shadow-md hover:dark:bg-neutral-800 hover:dark:shadow-sm hover:dark:shadow-black"
        onClick={onClick(pokemonB.id, pokemonA.id)}
      >
        <PokeImage id={pokemonB.id} alt={pokemonB.name} width={192} height={192} />
      </button>
    </div>
  );
}
