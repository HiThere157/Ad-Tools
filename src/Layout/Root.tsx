import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setEnvironment } from "../Redux/environment";
import { setDefaultQueryDomains } from "../Redux/preferences";
import { getDnsSuffixList, getEnvironment } from "../Helper/api";

import Footer from "../Components/Footer";
import Header from "../Components/Header/Header";
import Navigation from "../Components/Navigation/Navigation";
import Zoom from "../Components/Zoom";

type RootLayoutProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootLayoutProps) {
  const dispatch = useDispatch();

  const init = async () => {
    const [electronEnvironment, queryDomains] = await Promise.all([
      getEnvironment(),
      getDnsSuffixList(),
    ]);

    dispatch(setEnvironment(electronEnvironment));
    dispatch(setDefaultQueryDomains(queryDomains));
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <main
      style={{
        gridTemplateAreas: `
          "header header"
          "nav main"
          "footer main"
        `,
      }}
      className="grid h-screen w-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto] bg-dark text-white"
    >
      <Header />
      <Navigation />
      <Footer />

      <div style={{ gridArea: "main" }} className="overflow-auto">
        {children}
      </div>

      <Zoom />
    </main>
  );
}
