import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import {
  setAzureEnvironment,
  setElectronEnvironment,
  setPowershellEnvironment,
} from "../Redux/environmentSlice";
import { setDefaultQueryDomains } from "../Redux/preferencesSlice";
import {
  electronWindow,
  getAzureEnvironment,
  getDnsSuffixList,
  getElectronEnvironment,
  getPowershellEnvironment,
} from "../Helper/api";

import Footer from "../Components/Footer";
import Header from "../Components/Header/Header";
import Navigation from "../Components/Navigation/Navigation";
import Zoom from "../Components/Zoom";
import ScrollToTop from "../Components/ScrollToTop";
import ToastLayout from "./ToastLayout";

type RootLayoutProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootLayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const [electronEnvironment, azureEnvironment, powershellEnvironment, queryDomains] =
        await Promise.all([
          getElectronEnvironment(),
          getAzureEnvironment(),
          getPowershellEnvironment(),
          getDnsSuffixList(),
        ]);

      dispatch(setElectronEnvironment(electronEnvironment));
      dispatch(setAzureEnvironment(azureEnvironment));
      dispatch(setPowershellEnvironment(powershellEnvironment));
      dispatch(setDefaultQueryDomains(queryDomains));

      electronWindow.electronAPI?.checkForUpdates();
    })();
  }, [dispatch]);

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

      <div ref={scrollRef} style={{ gridArea: "main" }} className="overflow-auto">
        {children}
      </div>

      <Zoom />
      <ScrollToTop scrollRef={scrollRef} />
      <ToastLayout />
    </main>
  );
}
