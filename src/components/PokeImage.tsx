//import Image from "next/image";

type Props = {
  id: number;
  alt: string;
  width: number;
  height: number;
};

//using next/image makes my images 5kb instad of 0.5kb for some reason
/*
export function PokeImage({ id, alt, width, height }: Props) {
  return (
    <Image
      priority
      src={`/pokemon/${id + 1}.png`}
      alt={alt}
      width={width}
      height={height}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
*/

export function PokeImage({ id, alt, width, height }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/pokemon/${id + 1}.png`}
      alt={alt}
      width={width}
      height={height}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
