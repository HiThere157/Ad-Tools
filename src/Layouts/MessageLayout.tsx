type MessageLayoutProps = {
  children: React.ReactNode
}
export default function MessageLayout({ children }: MessageLayoutProps) {
  return (
    <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end space-y-2">
      {children}
    </div>
  )
}