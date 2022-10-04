import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { randomPageHref } from "src/utils/hashids";
import { Pokemon } from "src/utils/mons";
import { trpc } from "src/utils/trpc";

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
    console.log("sethref");
    const newHref = randomPageHref(pageId);
    console.log(`setting newHref: ${newHref}`);
    setHref(newHref);
  }, [pageId]);

  useEffect(() => {
    if (href) {
      console.log(`prefetching href: ${href}`);
      router.prefetch(href);
      //yes this only fires once. router is finicky.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [href]);

  const onClick = (forPokemonId: number, againstPokemonId: number) => () => {
    vote.mutate({ forPokemonId, againstPokemonId });
    router.push(href);
  };

  return (
    <div className="flex">
      <div>
        <button onClick={onClick(pokemonA.id, pokemonB.id)}>
          <PokeImage id={pokemonA.id} alt={pokemonA.name} />
        </button>

        <div>{pokemonA.name}</div>
      </div>
      <div>
        <button onClick={onClick(pokemonB.id, pokemonA.id)}>
          <PokeImage id={pokemonB.id} alt={pokemonB.name} />
        </button>
        <div>{pokemonB.name}</div>
      </div>
    </div>
  );
}

function PokeImage({ id, alt }: { id: number; alt: string }) {
  return (
    <Image src={`/pokemon/${id + 1}.png`} alt={alt} width={192} height={192} style={{ imageRendering: "pixelated" }} />
  );
}
