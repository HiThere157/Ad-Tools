import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setQuery } from "../Redux/dataSlice";
import { addTab } from "../Redux/tabsSlice";
import { defaultTab } from "../Config/default";

export function useRedirect() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirect = (page: string, query: Query) => {
    const newTabId = new Date().getTime();
    dispatch(addTab({ page, tab: { ...defaultTab, id: newTabId } }));
    dispatch(setQuery({ page, tabId: newTabId, query }));
    navigate(`/${page}?runImmediately=true`);
  };

  const useOnRedirect = (callback: () => void) => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
      if (searchParams.get("runImmediately") === "true") {
        callback();

        searchParams.delete("runImmediately");
        setSearchParams(searchParams);
      }
    }, [searchParams, setSearchParams, callback]);
  };

  return { redirect, useOnRedirect };
}
