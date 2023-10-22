import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setQuery } from "../Redux/data";
import { addTab } from "../Redux/tabs";
import { defaultTab } from "../Config/default";

export function useRedirect() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const redirect = (page: string, query: AdQuery) => {
    const newTabId = new Date().getTime();
    dispatch(addTab({ page, tab: { ...defaultTab, id: newTabId } }));
    dispatch(setQuery({ page, tabId: newTabId, query }));
    navigate(`/${page}?runImmediately=true`);
  };

  const onRedirect = (callback: () => void) => {
    useEffect(() => {
      if (searchParams.get("runImmediately") === "true") {
        callback();

        searchParams.delete("runImmediately");
        setSearchParams(searchParams);
      }
    }, [searchParams]);
  };

  return { redirect, onRedirect };
}
