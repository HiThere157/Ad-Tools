import { BsExclamationOctagon } from "react-icons/bs"

type ErrorMessageProps = {
  error?: string
}
export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <>
      {error && (
        <div className="flex justify-center items-center space-x-2 my-5 mx-3 text-foregroundError">
          <BsExclamationOctagon className="text-2xl flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </>
  );
}