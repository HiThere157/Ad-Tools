import Tabs from "../Components/Tabs/Tabs";

type TabLayoutProps = {
  page: string;
  children: React.ReactNode;
};
export default function TabLayout({ page, children }: TabLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <Tabs page={page} />

      <div className="flex-grow overflow-auto px-4 py-2">{children}</div>
    </div>
  );
}
