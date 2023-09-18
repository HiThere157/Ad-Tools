import Footer from "../Components/Footer";
import Header from "../Components/Header/Header";
import Navigation from "../Components/Navigation/Navigation";

type RootLayoutProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootLayoutProps) {
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
    </main>
  );
}
