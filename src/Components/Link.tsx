import { useGlobalState } from "../Hooks/useGlobalState";
import { addMessage } from "../Helper/handleMessage";

type LinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};
export default function Link({ href, className, children }: LinkProps) {
  const { setState } = useGlobalState();

  const clicked = () => {
    addMessage({ type: "info", message: "Opened Link in the Browser", timer: 7 }, setState);
  };

  return (
    <a href={href} className={className} onClick={clicked} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
