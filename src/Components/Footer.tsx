import { useEnvironment } from "../Helper/api";

export default function Footer() {
  const env = useEnvironment();

  return (
    <footer
      style={{ gridArea: "footer" }}
      className="flex justify-center bg-light p-1 text-xs text-grey"
    >
      <span>{env.appVersion}</span>
    </footer>
  );
}
