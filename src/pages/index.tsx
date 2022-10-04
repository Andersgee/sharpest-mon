import type { NextPage } from "next";
import { Head } from "src/components/Head";
import { ThemeToggleButton } from "src/components/ThemeToggleButton";

const Page: NextPage = () => {
  return (
    <>
      <Head
        title="Sharpest pokemon"
        description="Which pokemon is sharper?"
        domainUrl="https://sharpest.andyfx.net"
        url="https://sharpest.andyfx.net"
      />
      <ThemeToggleButton />
      <div>hello</div>
    </>
  );
};

export default Page;
