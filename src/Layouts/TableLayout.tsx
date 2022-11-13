import TableOfContents from "../Components/TableOfContents";

type TableLayoutProps = {
  children: React.ReactNode
}
export default function TableLayout({ children }: TableLayoutProps) {
  return (
    <div className="flex flex-col space-y-5">
      {children}
      <TableOfContents />
    </div>
  )
}