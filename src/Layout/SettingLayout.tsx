type SettingLayoutProps = {
  title: string;
  children: React.ReactNode;
};
export default function SettingLayout({ title, children }: SettingLayoutProps) {
  return (
    <div className="relative w-fit p-2">
      <div className="absolute inset-2 mt-5 rounded outline outline-1 outline-border" />

      <div className="relative z-10">
        <h2 className="ms-2 w-fit bg-dark px-1 text-2xl font-bold">{title}</h2>
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}
