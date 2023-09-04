import { useLocation } from "react-router-dom";

export function usePathMeta() {
  const { pathname, search } = useLocation();

  const page = pathname.split("/")[1] ?? "home";
  const tab = search.split("=")[1] ?? "0";

  return {
    page,
    tab,
  };
}
