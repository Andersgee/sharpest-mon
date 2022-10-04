import NextHead from "next/head";

interface Props {
  title: string;
  description: string;
  /**
   * The domain where icons, manifest etc lives
   *
   * for example https://www.andyfx.se (WITHOUT slash)
   */
  domainUrl: string;
  /**
   * The url of this specific page
   *
   * for example https://www.andyfx.se/contact
   */
  url: string;
  /**
   * the image shown when linking. should be large like 400?
   * default to "/icons/andyfx-192x192.png" but important to not forget this one
   */
  imageUrl?: string;
  /**
   * label1, data1 describes an extra "info card" when sharing. used by slack for example
   */
  twitter_label1?: string;
  twitter_data1?: string;
  /**
   * label2, data2 describes an extra "info card" when sharing. used by slack for example
   */
  twitter_label2?: string;
  twitter_data2?: string;
}

/**
 * meta tags for Search Engine Optimization (SEO) and page title
 */
export function Head({
  title,
  description,
  domainUrl,
  url,
  imageUrl = "/icons/andyfx-192x192.png",
  twitter_label1 = "",
  twitter_data1 = "",
  twitter_label2 = "",
  twitter_data2 = "",
}: Props) {
  return (
    <NextHead>
      <meta charSet="utf-8" />
      <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
      <link rel="icon" type="image/png" href="/icons/favicon.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="author" content="Anders Gustafsson" />
      <link rel="manifest" href="/manifest.json" />
      <title>{title}</title>
      {/* pwa related */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="theme-color" content="#FAFAFA" />{" "}
      {/* adress bar color, same as bgcolor looks good. */}
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon-192x192.png" />
      {/* facebook open graph tags*/}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      {/* twitter card tags additive with the og: tags*/}
      <meta name="twitter:domain" content={domainUrl} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={imageUrl} />
      {/* additional info Left*/}
      {twitter_label1 && (
        <meta name="twitter:label1" content={twitter_label1} />
      )}
      {twitter_data1 && <meta name="twitter:data1" content={twitter_data1} />}
      {/* additional info Right*/}
      {twitter_label2 && (
        <meta name="twitter:label2" content={twitter_label2} />
      )}
      {twitter_data2 && <meta name="twitter:data2" content={twitter_data2} />}
    </NextHead>
  );
}
