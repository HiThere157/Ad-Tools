import { useGlobalState } from "../Hooks/useGlobalState";

import Header from "../Components/Header";
import NavBar from "../Components/Navbar/NavBar";
import Footer from "../Components/Footer";

import ZoomLabel from "../Components/ZoomLabel";
import MessageLayout from "../Layouts/MessageLayout";
import Message from "../Components/Message";

type RootLayoutProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootLayoutProps) {
  const { state } = useGlobalState();

  return (
    <main
      style={{
        gridTemplateAreas: `"header header" "navbar content" "footer content"`,
      }}
      className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto] h-screen min-w-fit text-whiteColor bg-darkBg"
    >
      <Header />
      <NavBar />
      <Footer />

      <div
        id="js-scroll-container"
        style={{ gridArea: "content" }}
        className="px-4 py-2 overflow-auto"
      >
        {children}
      </div>

      <ZoomLabel />
      <MessageLayout>
        {state.messages?.map((message, index) => {
          return <Message key={index} message={message} />;
        })}
      </MessageLayout>
    </main>
  );
}
