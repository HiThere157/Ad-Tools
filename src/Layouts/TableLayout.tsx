type TableLayoutProps = {
  children: React.ReactNode;
};
export default function TableLayout({ children }: TableLayoutProps) {
  return <div className="flex flex-col gap-y-5">{children}</div>;
}
