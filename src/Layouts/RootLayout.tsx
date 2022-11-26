import { useLocalStorage } from "../Components/Hooks/useStorage";

import Header from "../Components/Header"
import NavBar from "../Components/NavBar";
import ZoomLabel from "../Components/ZoomLabel"

type RootLayoutProps = {
  children: React.ReactNode
}
export default function RootLayout({ children }: RootLayoutProps) {
  const [isNavOpen, setIsNavOpen] = useLocalStorage("main_isNavOpen", true);

  return (
    <main className="flex flex-col dark:text-foreground dark:bg-primaryBg h-screen">
      <Header
        onNavOpen={() => {
          setIsNavOpen(!isNavOpen);
        }}
      />
      <div className="flex flex-grow min-h-0">
        <NavBar isOpen={isNavOpen} />
        <ZoomLabel />
        <div className="flex-grow p-4 min-w-0 overflow-auto">{children}</div>
      </div>
    </main>
  );
}
