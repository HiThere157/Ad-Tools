type TabProps = {
  children: React.ReactNode;
  title: string;
};
export default function Tab({ children, title }: TabProps) {
  return (
    <div data-tab-title={title} className="flex-shrink-0 w-full">
      {children}
    </div>
  );
}
