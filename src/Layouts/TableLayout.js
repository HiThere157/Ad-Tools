import TableOfContents from "../Components/TableOfContents";

export default function TableLayout({children}){
  return (
    <div className="flex flex-col space-y-5">
      {children}
      <TableOfContents />
    </div>
  )
}