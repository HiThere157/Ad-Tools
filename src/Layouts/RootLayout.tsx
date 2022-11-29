import { useLocalStorage } from "../Hooks/useStorage";

import { useGlobalState } from "../Hooks/useGlobalState";

import Header from "../Components/Header";
import NavBar from "../Components/NavBar";
import ZoomLabel from "../Components/ZoomLabel";
import MessageLayout from "../Layouts/MessageLayout";
import Message from "../Components/Message";

type RootLayoutProps = {
  children: React.ReactNode
}
export default function RootLayout({ children }: RootLayoutProps) {
  const { state } = useGlobalState();
  const [isNavOpen, setIsNavOpen] = useLocalStorage("main_isNavOpen", true);

  return (
    <main className="flex flex-col dark:text-foreground dark:bg-primaryBg h-screen">
      <Header
        onNavOpen={() => setIsNavOpen(!isNavOpen)}
      />
      <div className="flex flex-grow min-h-0">
        <NavBar isOpen={isNavOpen} />
        <div className="flex-grow p-4 min-w-0 overflow-auto">{children}</div>
        <ZoomLabel />
        <MessageLayout>
          {state.messages?.map((message, index) => {
            return <Message key={index} message={message} />
          })}
        </MessageLayout>
      </div>
    </main>
  );
}
