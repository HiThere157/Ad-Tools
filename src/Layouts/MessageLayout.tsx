type MessageLayoutProps = {
  children: React.ReactNode;
};
export default function MessageLayout({ children }: MessageLayoutProps) {
  return (
    <div className="absolute z-[40] bottom-5 right-5 flex flex-col items-end gap-y-2">
      {children}
    </div>
  );
}
